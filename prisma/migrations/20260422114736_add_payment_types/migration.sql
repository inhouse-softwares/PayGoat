-- AlterTable
ALTER TABLE "payment_collections" ADD COLUMN     "paymentType" TEXT,
ADD COLUMN     "paymentTypeId" TEXT;

-- CreateTable
CREATE TABLE "payment_types" (
    "id" TEXT NOT NULL,
    "instanceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "payment_types_instanceId_idx" ON "payment_types"("instanceId");

-- CreateIndex
CREATE INDEX "payment_collections_paymentTypeId_idx" ON "payment_collections"("paymentTypeId");

-- AddForeignKey
ALTER TABLE "payment_types" ADD CONSTRAINT "payment_types_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "payment_instances"("id") ON DELETE CASCADE ON UPDATE CASCADE;
