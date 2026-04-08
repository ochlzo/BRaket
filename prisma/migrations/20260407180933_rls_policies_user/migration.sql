-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('client', 'talent');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "firstname" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastname" TEXT,
ADD COLUMN     "role" "UserRole",
ADD COLUMN     "username" TEXT;
