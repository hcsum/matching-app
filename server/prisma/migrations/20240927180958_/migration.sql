/*
  Warnings:

  - You are about to drop the column `questionnaire` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "matching_event" ADD COLUMN     "questionnaire" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "user" DROP COLUMN "questionnaire";
