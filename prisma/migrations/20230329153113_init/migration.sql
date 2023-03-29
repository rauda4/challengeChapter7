/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userGameBiodata" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "userGameId" TEXT NOT NULL,

    CONSTRAINT "userGameBiodata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameRoom" (
    "id" TEXT NOT NULL,
    "player_one" TEXT,
    "player_two" TEXT,
    "times" TEXT,
    "winner" TEXT,
    "room" TEXT,
    "Result" TEXT[],

    CONSTRAINT "GameRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_password_key" ON "user"("password");

-- CreateIndex
CREATE UNIQUE INDEX "userGameBiodata_name_key" ON "userGameBiodata"("name");

-- CreateIndex
CREATE UNIQUE INDEX "userGameBiodata_userGameId_key" ON "userGameBiodata"("userGameId");

-- AddForeignKey
ALTER TABLE "userGameBiodata" ADD CONSTRAINT "userGameBiodata_userGameId_fkey" FOREIGN KEY ("userGameId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
