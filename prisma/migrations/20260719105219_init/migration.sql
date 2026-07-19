/*
  Warnings:

  - A unique constraint covering the columns `[userId,key]` on the table `Memory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Memory_userId_key_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Memory_userId_key_key" ON "Memory"("userId", "key");
