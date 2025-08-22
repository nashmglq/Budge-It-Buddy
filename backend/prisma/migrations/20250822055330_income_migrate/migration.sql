-- CreateTable
CREATE TABLE "public"."income" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "income_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."income" ADD CONSTRAINT "income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
