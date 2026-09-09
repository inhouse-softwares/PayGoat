import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { requireAuth, requireAdmin, getInstanceFilter, withAuth } from "@/lib/auth-utils";
import { CreateInstanceSchema, PaginationSchema } from "@/lib/validation";
import { z } from "zod";
import { PaymentEntity, isNetworkError } from "@/lib/payment-store";

const MYIMOPAY_API_URL = process.env.MYIMOPAY_API_URL || "https://apipg.demo.myimopay.com";
const MYIMOPAY_MERCHANT_KEY = process.env.MYIMOPAY_MERCHANT_KEY;
const MYIMOPAY_AUTH_TOKEN = process.env.MYIMOPAY_AUTH_TOKEN;

export const GET = withAuth(async (request: NextRequest) => {
  await requireAuth();
  
  const searchParams = request.nextUrl.searchParams;
  const paginationResult = PaginationSchema.safeParse({
    page: searchParams.get("page"),
    pageSize: searchParams.get("pageSize"),
  });
  
  const { page, pageSize } = paginationResult.success
    ? paginationResult.data
    : { page: 1, pageSize: 50 };
  
  const filter = await getInstanceFilter();
  const where = filter.instanceId ? { id: filter.instanceId } : undefined;
  const collectionWhere = filter.instanceId ? { instanceId: filter.instanceId } : {};

  const [instances, total, collectionSums] = await Promise.all([
    prisma.paymentInstance.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        paymentTypes: {
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { collections: true },
        },
        operator: {
          select: { email: true },
        },
      },
    }),
    prisma.paymentInstance.count({ where }),
    prisma.paymentCollection.groupBy({
      by: ["instanceId"],
      _sum: { amount: true },
      where: collectionWhere,
    }),
  ]);

  // Merge collection sums into instances
  const sumMap = new Map(collectionSums.map((s) => [s.instanceId, s._sum.amount ?? 0]));
  const instancesWithSums = instances.map((inst) => ({
    ...inst,
    _sum: { collections: { amount: sumMap.get(inst.id) ?? 0 } },
  }));

  return NextResponse.json({
    data: instancesWithSums,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    await requireAdmin();

    const hasMyIMOManageCreds = !!(
      MYIMOPAY_MERCHANT_KEY && MYIMOPAY_AUTH_TOKEN &&
      !MYIMOPAY_MERCHANT_KEY.startsWith("your-") && !MYIMOPAY_AUTH_TOKEN.startsWith("your-")
    );
    const merchantKey = MYIMOPAY_MERCHANT_KEY || "";
    const authToken = MYIMOPAY_AUTH_TOKEN || "";

    const body = await request.json();
    const validatedData = CreateInstanceSchema.parse(body);
    const { name, idclPercent, summary, entities, formFields, paymentTypes } = validatedData;

    // Helper: create MyIMO Pay subaccounts for a list of entities
    async function buildSubaccounts(entityList: PaymentEntity[]): Promise<PaymentEntity[]> {
      if (!hasMyIMOManageCreds) {
        return entityList.map((entity: PaymentEntity) => ({ ...entity, myimopaySubaccountId: null }));
      }

      return Promise.all(entityList.map(async (entity: PaymentEntity) => {
        if (!entity.accountNumber || !entity.bankCode || !entity.businessName) {
          throw new Error(`Entity "${entity.name}" is missing bank details`);
        }
        
        let res;
        try {
          res = await fetch(`${MYIMOPAY_API_URL}/vi/entities/merchant/subaccounts/accounts/add`, {
            method: "POST",
            headers: {
              "mp-key": merchantKey,
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sub_name: entity.businessName,
              bank_code: entity.bankCode,
              bank_name: "",
              account_number: entity.accountNumber,
              account_name: entity.businessName,
              currency: "NGN",
              email_address: "",
              phone_number: "",
            }),
          });
        } catch (fetchError: unknown) {
          const message = fetchError instanceof Error ? fetchError.message : "Unknown error";
          throw new Error(`Network error while creating subaccount for "${entity.name}": ${message}`);
        }
        
        const data = await res.json();
        if (!data.header?.is_success) {
          throw new Error(`Subaccount creation failed for "${entity.name}": ${data.header?.remark || "Unknown error"}`);
        }
        
        const subaccountId = data.data;
        return { ...entity, myimopaySubaccountId: subaccountId };
      }));
    }

    // Helper: create a MyIMO Pay settlement order and return the order ID
    async function buildSettlementOrder(orderName: string, subaccounts: PaymentEntity[]): Promise<string> {
      if (!hasMyIMOManageCreds) {
        return `local-${Date.now()}`;
      }

      const orderItems = subaccounts.map((e) => ({
        subaccount_id: e.myimopaySubaccountId,
        percent_amount: e.percentage,
        fixed_amount: 0,
        is_settlement_fixed: false,
      }));

      let res;
      try {
        res = await fetch(`${MYIMOPAY_API_URL}/vi/entities/merchant/settlements/orders/add`, {
          method: "POST",
          headers: {
              "mp-key": merchantKey,
              Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            settlement_name: orderName,
            settle_merchant: false,
            override_charge_bearer: false,
            charge_bearer: 0,
            is_mixed_settlement: false,
            order_items: orderItems,
          }),
        });
        } catch (fetchError: unknown) {
          const message = fetchError instanceof Error ? fetchError.message : "Unknown error";
          throw new Error(`Network error while creating settlement order "${orderName}": ${message}`);
      }
      
      const data = await res.json();
      if (!data.header?.is_success) {
        throw new Error(`Settlement order creation failed for "${orderName}": ${data.header?.remark || "Unknown error"}`);
      }
      return data.data as string;
    }

    // 1. Create instance-level settlement order (only if entities are provided)
    let entitiesWithSubaccounts: PaymentEntity[] = [];
    let instanceSplitCode = `no-split-${Date.now()}`;
    if (Array.isArray(entities) && entities.length > 0) {
      entitiesWithSubaccounts = await buildSubaccounts(entities);
      instanceSplitCode = await buildSettlementOrder(name, entitiesWithSubaccounts);
    }

    // 2. For payment types that define their own entities, create per-type settlement orders
    const paymentTypesResolved = await Promise.all(
      paymentTypes.map(async (pt) => {
        const ptEntities: PaymentEntity[] = Array.isArray(pt.splitEntities) ? pt.splitEntities : [];
        if (ptEntities.length === 0) {
          return { ...pt, resolvedSplitCode: null, resolvedSplitEntities: [] };
        }
        const ptSubaccounts = await buildSubaccounts(ptEntities);
        const ptSplitCode = await buildSettlementOrder(`${name} - ${pt.name}`, ptSubaccounts);
        return { ...pt, resolvedSplitCode: ptSplitCode, resolvedSplitEntities: ptSubaccounts };
      }),
    );

    // 3. Prepare operator credentials
    const slug = name.toLowerCase().replace(/\s+/g, "").slice(0, 12);
    const rawPassword = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // 4. Atomic database transaction: create instance + operator
    const result = await prisma.$transaction(async (tx) => {
      const instance = await tx.paymentInstance.create({
        data: {
          name,
          splitCode: instanceSplitCode,
          idclPercent: typeof idclPercent === "number" ? idclPercent : parseFloat(idclPercent) || 0,
          summary,
          entities: entitiesWithSubaccounts,
          formFields,
          paymentTypes: {
            create: paymentTypesResolved.map((pt) => ({
              name: pt.name,
              description: pt.description || null,
              amount: pt.amount,
              splitCode: pt.resolvedSplitCode || null,
              splitEntities: pt.resolvedSplitEntities || [],
            })),
          },
        },
        include: { paymentTypes: true },
      });

      const suffix = instance.id.slice(-5);
      const operatorEmail = `${slug}.${suffix}@paygoat.com`;

      await tx.user.create({
        data: {
          email: operatorEmail,
          password: hashedPassword,
          plainPassword: rawPassword,
          role: "operator",
          instanceId: instance.id,
        },
      });

      return { instance, operatorEmail, operatorPassword: rawPassword };
    }, {
      maxWait: 10000,
      timeout: 30000,
    });

    return NextResponse.json(
      { ...result.instance, operatorEmail: result.operatorEmail, operatorPassword: result.operatorPassword },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error("Instance creation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorString = error instanceof Error ? error.toString() : String(error);

    if (isNetworkError(error)) {
      return NextResponse.json(
        { 
          error: "No internet connection", 
          details: "Unable to connect to MyIMO Pay API. Please check your internet connection and try again.",
          type: "NETWORK_ERROR"
        }, 
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: errorMessage || "Failed to create payment instance",
        details: errorString,
        type: "GENERAL_ERROR"
      }, 
      { status: 500 }
    );
  }
});
