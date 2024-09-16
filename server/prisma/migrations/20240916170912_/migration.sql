/*
  Warnings:

  - A unique constraint covering the columns `[wechatOpenId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_wechatOpenId_key" ON "user"("wechatOpenId");
