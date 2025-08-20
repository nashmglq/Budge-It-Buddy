-- CreateTable
CREATE TABLE "public"."user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "profilePic" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");
