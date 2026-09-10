ALTER TABLE "payment_instances"
  ADD COLUMN "paymentGateway" TEXT NOT NULL DEFAULT 'myimopay',
  ADD COLUMN "gatewayConfig" JSONB NOT NULL DEFAULT '{}';

-- Existing MyIMO Pay instances stored their settlement order in splitCode.
-- Preserve that configuration while moving new instances to gatewayConfig.
UPDATE "payment_instances"
SET "gatewayConfig" = jsonb_build_object('settlementId', "splitCode")
WHERE "splitCode" ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
