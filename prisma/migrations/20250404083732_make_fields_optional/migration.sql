-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'CUSTOMER', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT DEFAULT '',
ADD COLUMN     "phone" TEXT DEFAULT '',
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
