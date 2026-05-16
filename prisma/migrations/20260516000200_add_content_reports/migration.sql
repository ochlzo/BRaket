CREATE TYPE "report_target_type" AS ENUM (
  'PROFILE',
  'SERVICE',
  'REVIEW',
  'BOOKING',
  'PORTFOLIO'
);

CREATE TYPE "report_reason" AS ENUM (
  'SCAM_OR_FRAUD',
  'HARASSMENT_OR_ABUSE',
  'FAKE_PROFILE',
  'INAPPROPRIATE_CONTENT',
  'ACADEMIC_DISHONESTY',
  'COPYRIGHT_ISSUE',
  'SPAM',
  'OTHER'
);

CREATE TYPE "report_status" AS ENUM (
  'PENDING',
  'REVIEWED',
  'ACTIONED',
  'DISMISSED'
);

CREATE TABLE "content_reports" (
  "report_id" TEXT NOT NULL,
  "reporter_user_id" TEXT NOT NULL,
  "target_type" "report_target_type" NOT NULL,
  "target_id" TEXT NOT NULL,
  "target_label" TEXT NOT NULL,
  "target_path" TEXT,
  "reason" "report_reason" NOT NULL,
  "details" TEXT,
  "status" "report_status" NOT NULL DEFAULT 'PENDING',
  "admin_notes" TEXT,
  "reviewed_by_email" TEXT,
  "reviewed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "content_reports_pkey" PRIMARY KEY ("report_id")
);

CREATE UNIQUE INDEX "content_reports_reporter_user_id_target_type_target_id_key"
  ON "content_reports"("reporter_user_id", "target_type", "target_id");

CREATE INDEX "content_reports_status_created_at_idx"
  ON "content_reports"("status", "created_at");

CREATE INDEX "content_reports_target_type_target_id_idx"
  ON "content_reports"("target_type", "target_id");

ALTER TABLE "content_reports"
  ADD CONSTRAINT "content_reports_reporter_user_id_fkey"
  FOREIGN KEY ("reporter_user_id") REFERENCES "User"("user_id")
  ON DELETE CASCADE ON UPDATE CASCADE;
