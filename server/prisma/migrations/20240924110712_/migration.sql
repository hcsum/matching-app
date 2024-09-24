/*
  Warnings:

  - Added the required column `matchingStartsAt` to the `matching_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "matching_event" ADD COLUMN     "matchingStartsAt" TIMESTAMP(6) NOT NULL;
