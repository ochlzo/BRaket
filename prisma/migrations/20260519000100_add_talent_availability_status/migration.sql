CREATE TYPE "talent_availability_status" AS ENUM ('AVAILABLE', 'BUSY', 'UNAVAILABLE');

ALTER TABLE "TalentProfile"
  ADD COLUMN "availability_status" "talent_availability_status" NOT NULL DEFAULT 'AVAILABLE';
