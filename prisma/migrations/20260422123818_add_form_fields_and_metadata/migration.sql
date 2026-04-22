-- AlterTable
ALTER TABLE "payment_collections" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "payment_instances" ADD COLUMN     "formFields" JSONB NOT NULL DEFAULT '[]';
