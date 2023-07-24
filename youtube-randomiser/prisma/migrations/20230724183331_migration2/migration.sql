/*
  Warnings:

  - Changed the type of `mixData` on the `SavedMixes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "SavedMixes" DROP COLUMN "mixData",
ADD COLUMN     "mixData" JSONB NOT NULL;
