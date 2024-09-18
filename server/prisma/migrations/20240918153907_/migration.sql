/*
  Warnings:

  - You are about to drop the column `url` on the `photo` table. All the data in the column will be lost.
  - Added the required column `cosLocation` to the `photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "photo" DROP COLUMN "url",
ADD COLUMN     "cosLocation" VARCHAR NOT NULL;
