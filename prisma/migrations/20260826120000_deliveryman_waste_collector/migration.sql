-- Link each deliveryman profile to the single owning company/user profile (tbl_waste_collector).
ALTER TABLE "tbl_deliveryman" ADD COLUMN "waste_collector_id" TEXT;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM "tbl_deliveryman" WHERE "waste_collector_id" IS NULL)
     AND NOT EXISTS (SELECT 1 FROM "tbl_waste_collector") THEN
    RAISE EXCEPTION 'Cannot backfill tbl_deliveryman.waste_collector_id: create a tbl_waste_collector row first';
  END IF;
END $$;

UPDATE "tbl_deliveryman"
SET "waste_collector_id" = (SELECT "id" FROM "tbl_waste_collector" LIMIT 1)
WHERE "waste_collector_id" IS NULL;

ALTER TABLE "tbl_deliveryman" ALTER COLUMN "waste_collector_id" SET NOT NULL;

ALTER TABLE "tbl_deliveryman"
ADD CONSTRAINT "tbl_deliveryman_waste_collector_id_fkey"
FOREIGN KEY ("waste_collector_id") REFERENCES "tbl_waste_collector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
