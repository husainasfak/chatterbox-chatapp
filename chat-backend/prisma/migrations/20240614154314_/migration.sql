-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isSignInCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
