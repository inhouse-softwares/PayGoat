-- RenameColumn: Rename paystackReference to paymentReference
ALTER TABLE "payment_collections" RENAME COLUMN "paystackReference" TO "paymentReference";

-- RenameIndex: Rename the unique index to match the new column name
ALTER INDEX "payment_collections_paystackReference_key" RENAME TO "payment_collections_paymentReference_key";

-- AlterTable: Add new columns
ALTER TABLE "payment_collections" ADD COLUMN "transactionId" TEXT;
ALTER TABLE "payment_collections" ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'pending';

-- CreateIndex: Unique constraint on transactionId
CREATE UNIQUE INDEX "payment_collections_transactionId_key" ON "payment_collections"("transactionId");

-- CreateIndex: Index on paymentStatus for reconciliation queries
CREATE INDEX "payment_collections_paymentStatus_idx" ON "payment_collections"("paymentStatus");
