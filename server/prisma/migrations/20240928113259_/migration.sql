/*
  Warnings:

  - A unique constraint covering the columns `[matchingEventId,eventNumber]` on the table `participant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "participant" ADD COLUMN     "eventNumber" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "participant_matchingEventId_eventNumber_key" ON "participant"("matchingEventId", "eventNumber");
