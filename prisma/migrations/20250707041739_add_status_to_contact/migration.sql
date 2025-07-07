-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('OPEN', 'INPROGRESS', 'CLOSED');

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "status" "ContactStatus" NOT NULL DEFAULT 'OPEN';
