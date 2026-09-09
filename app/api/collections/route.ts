import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/prisma";
import { requireAuth, getInstanceFilter, withAuth } from "@/lib/auth-utils";
import { PaginationSchema } from "@/lib/validation";

export const GET = withAuth(async (request: NextRequest) => {
  // Require authentication
  await requireAuth();
  
  const searchParams = request.nextUrl.searchParams;
  const requestedInstanceId = searchParams.get("instanceId");
  const fromDate = searchParams.get("fromDate");
  const toDate = searchParams.get("toDate");
  const paymentTypeId = searchParams.get("paymentTypeId");
  const search = searchParams.get("search");
  
  // Parse pagination params
  const paginationResult = PaginationSchema.safeParse({
    page: searchParams.get("page"),
    pageSize: searchParams.get("pageSize"),
  });
  
  const { page, pageSize } = paginationResult.success
    ? paginationResult.data
    : { page: 1, pageSize: 50 };
  
  // Get instance filter based on user role
  // Admins can query all or filter by instanceId
  // Operators automatically filtered to their instance
  const roleFilter = await getInstanceFilter();
  
  // If operator is trying to query different instance, use their filter
  // If admin requests specific instance, use that
  const instanceFilter = requestedInstanceId && !roleFilter.instanceId
    ? { instanceId: requestedInstanceId }
    : roleFilter.instanceId
    ? roleFilter
    : requestedInstanceId
    ? { instanceId: requestedInstanceId }
    : {};

  // Build where clause incrementally
  const where: Prisma.PaymentCollectionWhereInput = { ...instanceFilter };

  // Date range conditions
  if (fromDate) {
    where.createdAt = { ...(where.createdAt as object), gte: new Date(fromDate) };
  }
  if (toDate) {
    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);
    where.createdAt = { ...(where.createdAt as object), lte: endDate };
  }

  // Payment type filter
  if (paymentTypeId) {
    where.paymentTypeId = paymentTypeId;
  }

  // Text search on payer and paymentReference
  if (search) {
    where.OR = [
      { payer: { contains: search } },
      { paymentReference: { contains: search } },
    ];
  }

  // Execute count and data queries in parallel
  const [collections, total] = await Promise.all([
    prisma.paymentCollection.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
      include: {
        instance: {
          select: {
            name: true,
            splitCode: true,
          },
        },
      },
    }),
    prisma.paymentCollection.count({ where }),
  ]);

  return NextResponse.json({
    data: collections,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  });
});

export const POST = withAuth(async (request: NextRequest) => {
  // Require authentication
  const session = await requireAuth();
  
  const body = await request.json();

  if (body.length === 0 || !body.instanceId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  
  // Verify user has access to this instance
  if (session.role === "operator" && session.instanceId !== body.instanceId) {
    return NextResponse.json(
      { error: "Forbidden: Cannot create collection for another instance" },
      { status: 403 }
    );
  }

  const collection = await prisma.paymentCollection.create({
    data: body,
  });

  return NextResponse.json(collection, { status: 201 });
});
