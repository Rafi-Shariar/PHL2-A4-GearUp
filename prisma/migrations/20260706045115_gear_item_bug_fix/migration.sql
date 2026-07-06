/*
  Warnings:

  - You are about to drop the column `stoke` on the `gear_items` table. All the data in the column will be lost.
  - Added the required column `stock` to the `gear_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "gear_items" DROP COLUMN "stoke",
ADD COLUMN     "stock" INTEGER NOT NULL;
