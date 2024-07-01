/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('ADMIN', 'MODERATOR', 'GUEST');

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "messages";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_conversation" (
    "id" TEXT NOT NULL,
    "initiatorId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_participant" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "hasSeenLatestMessage" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "private_participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "private_message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "fileUrl" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT,
    "deletedById" TEXT NOT NULL,

    CONSTRAINT "private_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userName_key" ON "users"("userName");

-- CreateIndex
CREATE INDEX "private_participant_conversationId_idx" ON "private_participant"("conversationId");

-- CreateIndex
CREATE INDEX "private_participant_userId_idx" ON "private_participant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "private_participant_userId_conversationId_key" ON "private_participant"("userId", "conversationId");

-- CreateIndex
CREATE INDEX "private_message_conversationId_idx" ON "private_message"("conversationId");

-- CreateIndex
CREATE INDEX "private_message_created_at_idx" ON "private_message"("created_at");

-- AddForeignKey
ALTER TABLE "private_conversation" ADD CONSTRAINT "private_conversation_initiatorId_fkey" FOREIGN KEY ("initiatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_conversation" ADD CONSTRAINT "private_conversation_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_participant" ADD CONSTRAINT "private_participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_participant" ADD CONSTRAINT "private_participant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "private_conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_message" ADD CONSTRAINT "private_message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "private_conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_message" ADD CONSTRAINT "private_message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_message" ADD CONSTRAINT "private_message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "private_message" ADD CONSTRAINT "private_message_deletedById_fkey" FOREIGN KEY ("deletedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
