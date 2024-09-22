/*
  Warnings:

  - You are about to drop the column `hasUpdatedProfile` on the `participant` table. All the data in the column will be lost.
  - The `postMatchingAction` column on the `participant` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "participant_postMatchingAction" AS ENUM ('INSIST', 'REVERSE');

-- AlterTable
ALTER TABLE "participant" DROP COLUMN "hasUpdatedProfile",
DROP COLUMN "postMatchingAction",
ADD COLUMN     "postMatchingAction" "participant_postMatchingAction";
