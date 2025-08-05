/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `planName` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `planType` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionEnd` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionStart` on the `payments` table. All the data in the column will be lost.
  - Added the required column `userId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."payments" DROP COLUMN "customerEmail",
DROP COLUMN "customerName",
DROP COLUMN "planName",
DROP COLUMN "planType",
DROP COLUMN "priceId",
DROP COLUMN "productId",
DROP COLUMN "subscriptionEnd",
DROP COLUMN "subscriptionId",
DROP COLUMN "subscriptionStart",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "planName" TEXT,
    "planType" TEXT,
    "priceId" TEXT,
    "productId" TEXT,
    "currency" TEXT,
    "amount" INTEGER,
    "subscriptionStart" TIMESTAMP(3),
    "subscriptionEnd" TIMESTAMP(3),
    "invoiceStatus" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "public"."users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_subscriptionId_key" ON "public"."users"("subscriptionId");

-- AddForeignKey
ALTER TABLE "public"."payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
