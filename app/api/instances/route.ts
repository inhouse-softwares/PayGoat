import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";
import { requireAuth, requireAdmin, getInstanceFilter, withAuth } from "@/lib/auth-utils";
import { CreateInstanceSchema, PaginationSchema } from "@/lib/validation";
import { z } from "zod";

export const GET = withAuth(async (request: NextRequest) => {
  await requireAuth();
  const params = request.nextUrl.searchParams;
  const pagination = PaginationSchema.safeParse({ page: params.get("page"), pageSize: params.get("pageSize") });
  const { page, pageSize } = pagination.success ? pagination.data : { page: 1, pageSize: 50 };
  const filter = await getInstanceFilter();
  const where = filter.instanceId ? { id: filter.instanceId } : undefined;
  const collectionWhere = filter.instanceId ? { instanceId: filter.instanceId } : {};
  const [instances, total, sums] = await Promise.all([
    prisma.paymentInstance.findMany({ where, orderBy: { createdAt: "desc" }, take: pageSize, skip: (page - 1) * pageSize, include: { paymentTypes: { orderBy: { createdAt: "asc" } }, _count: { select: { collections: true } }, operator: { select: { email: true } } } }),
    prisma.paymentInstance.count({ where }),
    prisma.paymentCollection.groupBy({ by: ["instanceId"], _sum: { amount: true }, where: collectionWhere }),
  ]);
  const sumMap = new Map(sums.map((sum) => [sum.instanceId, sum._sum.amount ?? 0]));
  return NextResponse.json({ data: instances.map((instance) => ({ ...instance, _sum: { collections: { amount: sumMap.get(instance.id) ?? 0 } } })), pagination: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) } });
});

export const POST = withAuth(async (request: NextRequest) => {
  try {
    await requireAdmin();
    const data = CreateInstanceSchema.parse(await request.json());
    if (data.gatewayConfiguration.gateway === "paystack") {
      return NextResponse.json({ error: "Paystack support is coming soon. Select MyIMO Pay to create an instance." }, { status: 422 });
    }

    const slug = data.name.toLowerCase().replace(/\s+/g, "").slice(0, 12);
    const rawPassword = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const result = await prisma.$transaction(async (tx) => {
      const instance = await tx.paymentInstance.create({
        data: {
          name: data.name,
          // Legacy field retained for existing collections; payment routing uses gatewayConfig.
          splitCode: `legacy-${crypto.randomUUID()}`,
          idclPercent: data.idclPercent,
          summary: data.summary,
          entities: [],
          paymentGateway: data.gatewayConfiguration.gateway,
          gatewayConfig: data.gatewayConfiguration.config,
          formFields: data.formFields,
          paymentTypes: { create: data.paymentTypes.map((type) => ({ name: type.name, description: type.description || null, amount: type.amount })) },
        },
        include: { paymentTypes: true },
      });
      const operatorEmail = `${slug}.${instance.id.slice(-5)}@paygoat.com`;
      await tx.user.create({ data: { email: operatorEmail, password: hashedPassword, plainPassword: rawPassword, role: "operator", instanceId: instance.id } });
      return { instance, operatorEmail, operatorPassword: rawPassword };
    }, { maxWait: 10000, timeout: 30000 });
    return NextResponse.json({ ...result.instance, operatorEmail: result.operatorEmail, operatorPassword: result.operatorPassword }, { status: 201 });
  } catch (error: unknown) {
    console.error("Instance creation error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create payment instance" }, { status: 500 });
  }
});
