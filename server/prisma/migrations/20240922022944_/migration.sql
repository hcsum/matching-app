/*
  Warnings:

  - The `phase` column on the `matching_event` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "matching_event_phase" AS ENUM ('INACTIVE', 'ENROLLING', 'CHOOSING', 'MATCHING', 'FINISHED');

-- AlterTable
ALTER TABLE "matching_event" DROP COLUMN "phase",
ADD COLUMN     "phase" "matching_event_phase" NOT NULL DEFAULT 'INACTIVE';
