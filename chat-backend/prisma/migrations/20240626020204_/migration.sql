/*
  Warnings:

  - You are about to drop the column `deletedById` on the `private_message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[initiatorId,recipientId]` on the table `private_conversation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "private_message" DROP CONSTRAINT "private_message_deletedById_fkey";

-- AlterTable
ALTER TABLE "private_conversation" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "private_message" DROP COLUMN "deletedById";

-- AlterTable
ALTER TABLE "private_participant" ALTER COLUMN "hasSeenLatestMessage" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "private_conversation_initiatorId_recipientId_key" ON "private_conversation"("initiatorId", "recipientId");
