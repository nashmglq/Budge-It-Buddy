/*
  Warnings:

  - Made the column `userId` on table `expenses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `income` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."expenses" DROP CONSTRAINT "expenses_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."income" DROP CONSTRAINT "income_userId_fkey";

-- AlterTable
ALTER TABLE "public"."expenses" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."income" ALTER COLUMN "userId" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."chat" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "isAI" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."expenses" ADD CONSTRAINT "expenses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."income" ADD CONSTRAINT "income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."chat" ADD CONSTRAINT "chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
