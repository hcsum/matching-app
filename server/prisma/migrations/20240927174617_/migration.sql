/*
  Warnings:

  - You are about to drop the column `monthAndYearOfBirth` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "monthAndYearOfBirth",
ADD COLUMN     "hometown" VARCHAR,
ADD COLUMN     "mbti" VARCHAR;
