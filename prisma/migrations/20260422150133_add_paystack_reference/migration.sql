/*
  Warnings:

  - A unique constraint covering the columns `[paystackReference]` on the table `payment_collections` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payment_collections" ADD COLUMN     "paystackReference" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payment_collections_paystackReference_key" ON "payment_collections"("paystackReference");
