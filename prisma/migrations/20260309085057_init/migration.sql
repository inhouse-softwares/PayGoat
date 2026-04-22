-- CreateTable
CREATE TABLE "payment_instances" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "splitCode" TEXT NOT NULL,
    "idclPercent" DOUBLE PRECISION NOT NULL,
    "summary" TEXT NOT NULL,
    "entities" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_instances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_collections" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "instanceName" TEXT NOT NULL,
    "splitCode" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "idclAmount" DOUBLE PRECISION NOT NULL,
    "motAmount" DOUBLE PRECISION NOT NULL,
    "collectedAt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_collections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_instances_splitCode_key" ON "payment_instances"("splitCode");

-- CreateIndex
CREATE INDEX "payment_collections_instanceId_idx" ON "payment_collections"("instanceId");

-- AddForeignKey
ALTER TABLE "payment_collections" ADD CONSTRAINT "payment_collections_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "payment_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
