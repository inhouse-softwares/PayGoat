ALTER TABLE "payment_collections"
  ADD COLUMN "idempotencyKey" TEXT,
  ADD COLUMN "paymentLink" TEXT;

CREATE UNIQUE INDEX "payment_collections_idempotencyKey_key"
  ON "payment_collections"("idempotencyKey");
