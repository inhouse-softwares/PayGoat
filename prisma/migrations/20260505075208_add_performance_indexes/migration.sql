/*
  Warnings:

  - A unique constraint covering the columns `[instanceId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payment_collections" ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "payment_types" ADD COLUMN     "splitCode" TEXT,
ADD COLUMN     "splitEntities" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "instanceId" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "plainPassword" TEXT;

-- CreateIndex
CREATE INDEX "payment_collections_collectedAt_idx" ON "payment_collections"("collectedAt");

-- CreateIndex
CREATE INDEX "payment_collections_payer_idx" ON "payment_collections"("payer");

-- CreateIndex
CREATE INDEX "payment_collections_createdAt_idx" ON "payment_collections"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "users_instanceId_key" ON "users"("instanceId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_instanceId_fkey" FOREIGN KEY ("instanceId") REFERENCES "payment_instances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
