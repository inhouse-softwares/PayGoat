import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { requireAuth, requireAdmin, getInstanceFilter, withAuth } from "@/lib/auth-utils";
import { CreateInstanceSchema, PaginationSchema } from "@/lib/validation";
import { z } from "zod";

export const GET = withAuth(async (request: NextRequest) => {
  // Require authentication
  await requireAuth();
  
  // Parse pagination params
  const searchParams = request.nextUrl.searchParams;
  const paginationResult = PaginationSchema.safeParse({
    page: searchParams.get("page"),
    pageSize: searchParams.get("pageSize"),
  });
  
  const { page, pageSize } = paginationResult.success
    ? paginationResult.data
    : { page: 1, pageSize: 50 };
  
  // Get instance filter based on user role
  // Admins see all instances, operators see only theirs
  const filter = await getInstanceFilter();
  const where = filter.instanceId ? { id: filter.instanceId } : undefined;

  // Execute count and data queries in parallel
  const [instances, total] = await Promise.all([
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
  ]);

  return NextResponse.json({
    data: instances,
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
    // Only admins can create instances
    await requireAdmin();
    
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json({ error: "PAYSTACK_SECRET_KEY is not configured" }, { status: 500 });
    }

    const body = await request.json();
    
    // Validate input with Zod
    const validatedData = CreateInstanceSchema.parse(body);
    const { name, idclPercent, summary, entities, formFields, paymentTypes } = validatedData;

    // Helper: create Paystack subaccounts for a list of entities
    async function buildSubaccounts(entityList: any[]): Promise<any[]> {
      return Promise.all(entityList.map(async (entity: any) => {
        if (!entity.accountNumber || !entity.bankCode || !entity.businessName) {
          throw new Error(`Entity "${entity.name}" is missing bank details`);
        }
        
        let res;
        try {
          res = await fetch("https://api.paystack.co/subaccount", {
            method: "POST",
            headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              business_name: entity.businessName,
              settlement_bank: entity.bankCode,
              account_number: entity.accountNumber,
              percentage_charge: entity.percentage,
            }),
          });
        } catch (fetchError: any) {
          throw new Error(`Network error while creating subaccount for "${entity.name}": ${fetchError.message}`);
        }
        
        const data = await res.json();
        if (!data.status) throw new Error(`Subaccount creation failed for "${entity.name}": ${data.message}`);
        return { ...entity, paystackSubaccountCode: data.data.subaccount_code };
      }));
    }

    // Helper: create a Paystack split and return the split_code
    async function buildSplit(splitName: string, subaccounts: any[]): Promise<string> {
      let res;
      try {
        res = await fetch("https://api.paystack.co/split", {
          method: "POST",
          headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            name: splitName,
            type: "percentage",
            currency: "NGN",
            bearer_type: "all",
            subaccounts: subaccounts.map((e) => ({ subaccount: e.paystackSubaccountCode, share: e.percentage })),
          }),
        });
      } catch (fetchError: any) {
        throw new Error(`Network error while creating split "${splitName}": ${fetchError.message}`);
      }
      
      const data = await res.json();
      if (!data.status) throw new Error(`Split creation failed for "${splitName}": ${data.message}`);
      return data.data.split_code as string;
    }

    // 1. Create instance-level Paystack split (only if entities are provided)
    let entitiesWithSubaccounts: any[] = [];
    let instanceSplitCode = `no-split-${Date.now()}`;
    if (Array.isArray(entities) && entities.length > 0) {
    entitiesWithSubaccounts = await buildSubaccounts(entities);
    instanceSplitCode = await buildSplit(name, entitiesWithSubaccounts);
  }

  // 2. For payment types that define their own entities, create per-type splits
  const paymentTypesResolved = await Promise.all(
    paymentTypes.map(async (pt: any) => {
      const ptEntities: any[] = Array.isArray(pt.splitEntities) ? pt.splitEntities : [];
      if (ptEntities.length === 0) {
        return { ...pt, resolvedSplitCode: null, resolvedSplitEntities: [] };
      }
      const ptSubaccounts = await buildSubaccounts(ptEntities);
      const ptSplitCode = await buildSplit(`${name} - ${pt.name}`, ptSubaccounts);
      return { ...pt, resolvedSplitCode: ptSplitCode, resolvedSplitEntities: ptSubaccounts };
    }),
  );

  // 3. Prepare operator credentials
  const slug = name.toLowerCase().replace(/\s+/g, "").slice(0, 12);
  const rawPassword = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 4. Atomic database transaction: create instance + operator
  const result = await prisma.$transaction(async (tx) => {
    // Create the payment instance
    const instance = await tx.paymentInstance.create({
      data: {
        name,
        splitCode: instanceSplitCode,
        idclPercent: typeof idclPercent === "number" ? idclPercent : parseFloat(idclPercent) || 0,
        summary,
        entities: entitiesWithSubaccounts,
        formFields,
        paymentTypes: {
          create: paymentTypesResolved.map((pt: any) => ({
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

    // Auto-generate operator account for this instance
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
    maxWait: 10000, // Wait up to 10s to start a transaction
    timeout: 30000, // Transaction must complete within 30s
  });

  return NextResponse.json(
    { ...result.instance, operatorEmail: result.operatorEmail, operatorPassword: result.operatorPassword },
    { status: 201 },
  );
  } catch (error: any) {
    console.error("Instance creation error:", error);

    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((e) => ({ field: e.path.join("."), message: e.message })),
        },
        { status: 400 }
      );
    }

    // Check for network/internet connection errors
    const isNetworkError = 
      error.cause?.code === 'ENOTFOUND' ||
      error.cause?.code === 'ECONNREFUSED' ||
      error.cause?.code === 'ETIMEDOUT' ||
      error.cause?.code === 'EAI_AGAIN' ||
      (error.name === 'TypeError' && error.message?.includes('fetch failed')) ||
      error.message?.toLowerCase().includes('network') ||
      error.message?.toLowerCase().includes('internet');

    if (isNetworkError) {
      return NextResponse.json(
        { 
          error: "No internet connection", 
          details: "Unable to connect to Paystack API. Please check your internet connection and try again.",
          type: "NETWORK_ERROR"
        }, 
        { status: 503 }
      );
    }

    // Return the original error message for other errors
    return NextResponse.json(
      { 
        error: error.message || "Failed to create payment instance",
        details: error.toString(),
        type: "GENERAL_ERROR"
      }, 
      { status: 500 }
    );
  }
});
