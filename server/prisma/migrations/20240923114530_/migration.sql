/*
  Warnings:

  - A unique constraint covering the columns `[matchingEventId,madeByUserId,pickedUserId]` on the table `picking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "refNo" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "UQ_matchingEventId_madeByUserId_pickedUserId" ON "picking"("matchingEventId", "madeByUserId", "pickedUserId");
