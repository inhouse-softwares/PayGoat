import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { cookies } from "next/headers";

function parseSession(value: string | undefined) {
  if (!value) return null;
  const [role, instanceId] = value.split("|");
  if (role === "admin") return { role: "admin" as const, instanceId: undefined };
  if (role === "operator") return { role: "operator" as const, instanceId: instanceId || undefined };
  return null;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = parseSession(cookieStore.get("paygoat_session")?.value);

    // Operators only see their own instance
    const where = session?.role === "operator" && session.instanceId
      ? { id: session.instanceId }
      : {};

    const instances = await prisma.paymentInstance.findMany({
      where,
      orderBy: { createdAt: "desc" },
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
    });

    return NextResponse.json(instances);
  } catch (error) {
    console.error("Error fetching instances:", error);
    return NextResponse.json(
      { error: "Failed to fetch instances" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY is not configured" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { name, idclPercent = 0, summary, entities = [], formFields = [], paymentTypes = [] } = body;

    if (!name || !summary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Helper: create Paystack subaccounts for a list of entities
    async function buildSubaccounts(entityList: any[]): Promise<any[]> {
      return Promise.all(entityList.map(async (entity: any) => {
        if (!entity.accountNumber || !entity.bankCode || !entity.businessName) {
          throw new Error(`Entity "${entity.name}" is missing bank details`);
        }
        const res = await fetch("https://api.paystack.co/subaccount", {
          method: "POST",
          headers: { Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            business_name: entity.businessName,
            settlement_bank: entity.bankCode,
            account_number: entity.accountNumber,
            percentage_charge: entity.percentage,
          }),
        });
        const data = await res.json();
        if (!data.status) throw new Error(`Subaccount creation failed for "${entity.name}": ${data.message}`);
        return { ...entity, paystackSubaccountCode: data.data.subaccount_code };
      }));
    }

    // Helper: create a Paystack split and return the split_code
    async function buildSplit(splitName: string, subaccounts: any[]): Promise<string> {
      const res = await fetch("https://api.paystack.co/split", {
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

    // 3. Persist the instance
    const instance = await prisma.paymentInstance.create({
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

    // 4. Auto-generate a dedicated operator account for this instance
    const slug = name.toLowerCase().replace(/\s+/g, "").slice(0, 12);
    const suffix = instance.id.slice(-5);
    const operatorEmail = `${slug}.${suffix}@paygoat.com`;
    const rawPassword = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await prisma.user.create({
      data: {
        email: operatorEmail,
        password: hashedPassword,
        plainPassword: rawPassword,
        role: "operator",
        instanceId: instance.id,
      },
    });

    return NextResponse.json(
      { ...instance, operatorEmail, operatorPassword: rawPassword },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating instance:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create instance" },
      { status: 500 },
    );
  }
}
