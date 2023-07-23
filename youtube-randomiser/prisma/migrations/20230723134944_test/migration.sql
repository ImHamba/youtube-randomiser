-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "SavedMixes" (
    "mixId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mixData" TEXT NOT NULL,

    CONSTRAINT "SavedMixes_pkey" PRIMARY KEY ("mixId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
