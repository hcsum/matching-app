/*
  Warnings:

  - A unique constraint covering the columns `[loginToken]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_loginToken_key" ON "user"("loginToken");
