import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const instances = await prisma.paymentInstance.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        paymentTypes: {
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { collections: true },
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
    const { name, idclPercent = 0, summary, entities, formFields = [], paymentTypes = [] } = body;

    if (!name || !summary || !Array.isArray(entities) || entities.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Create a Paystack subaccount for each entity
    const entitiesWithSubaccounts = await Promise.all(
      entities.map(async (entity: any) => {
        if (!entity.accountNumber || !entity.bankCode || !entity.businessName) {
          throw new Error(`Entity "${entity.name}" is missing bank details (business name, account number, or bank)`);
        }

        const res = await fetch("https://api.paystack.co/subaccount", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            business_name: entity.businessName,
            settlement_bank: entity.bankCode,
            account_number: entity.accountNumber,
            percentage_charge: entity.percentage,
          }),
        });

        const data = await res.json();

        if (!data.status) {
          throw new Error(`Subaccount creation failed for "${entity.name}": ${data.message}`);
        }

        return { ...entity, paystackSubaccountCode: data.data.subaccount_code };
      }),
    );

    // 2. Create a Paystack split using the subaccounts
    const splitRes = await fetch("https://api.paystack.co/split", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        type: "percentage",
        currency: "NGN",
        bearer_type: "all",
        subaccounts: entitiesWithSubaccounts.map((e) => ({
          subaccount: e.paystackSubaccountCode,
          share: e.percentage,
        })),
      }),
    });

    const splitData = await splitRes.json();

    if (!splitData.status) {
      throw new Error(`Split creation failed: ${splitData.message}`);
    }

    const splitCode: string = splitData.data.split_code;

    // 3. Persist the instance with the Paystack-generated split code
    const instance = await prisma.paymentInstance.create({
      data: {
        name,
        splitCode,
        idclPercent: typeof idclPercent === "number" ? idclPercent : parseFloat(idclPercent) || 0,
        summary,
        entities: entitiesWithSubaccounts,
        formFields,
        paymentTypes: {
          create: paymentTypes.map((pt: any) => ({
            name: pt.name,
            description: pt.description || null,
            amount: pt.amount,
          })),
        },
      },
      include: { paymentTypes: true },
    });

    return NextResponse.json(instance, { status: 201 });
  } catch (error: any) {
    console.error("Error creating instance:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create instance" },
      { status: 500 },
    );
  }
}
