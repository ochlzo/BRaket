CREATE TABLE "talent_verification_email_otps" (
  "otp_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "bu_email" TEXT NOT NULL,
  "code_hash" TEXT NOT NULL,
  "expires_at" TIMESTAMP(3) NOT NULL,
  "consumed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "talent_verification_email_otps_pkey" PRIMARY KEY ("otp_id")
);

CREATE INDEX "talent_verification_email_otps_user_id_bu_email_created_at_idx"
  ON "talent_verification_email_otps"("user_id", "bu_email", "created_at");

CREATE INDEX "talent_verification_email_otps_expires_at_idx"
  ON "talent_verification_email_otps"("expires_at");

ALTER TABLE "talent_verification_email_otps"
  ADD CONSTRAINT "talent_verification_email_otps_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "User"("user_id")
  ON DELETE CASCADE ON UPDATE CASCADE;
