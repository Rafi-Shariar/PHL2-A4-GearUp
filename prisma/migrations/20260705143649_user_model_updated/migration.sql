/*
  Warnings:

  - You are about to drop the column `AccountStatus` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "AccountStatus",
ADD COLUMN     "accountStatus" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "photoURL" TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "address" SET DEFAULT 'Not Provided';
