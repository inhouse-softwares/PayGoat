-- The database used in early deployments may already have paymentReference
-- (without ever receiving paystackReference). Make this historical migration
-- safe to apply to either shape.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'payment_collections' AND column_name = 'paystackReference'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'payment_collections' AND column_name = 'paymentReference'
  ) THEN
    ALTER TABLE "payment_collections" RENAME COLUMN "paystackReference" TO "paymentReference";
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'payment_collections_paystackReference_key')
    AND NOT EXISTS (SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'payment_collections_paymentReference_key') THEN
    ALTER INDEX "payment_collections_paystackReference_key" RENAME TO "payment_collections_paymentReference_key";
  END IF;
END $$;

ALTER TABLE "payment_collections" ADD COLUMN IF NOT EXISTS "transactionId" TEXT;
ALTER TABLE "payment_collections" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT NOT NULL DEFAULT 'pending';
CREATE UNIQUE INDEX IF NOT EXISTS "payment_collections_transactionId_key" ON "payment_collections"("transactionId");
CREATE INDEX IF NOT EXISTS "payment_collections_paymentStatus_idx" ON "payment_collections"("paymentStatus");
