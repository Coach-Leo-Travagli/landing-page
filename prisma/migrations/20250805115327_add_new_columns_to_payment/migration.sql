/*
  Warnings:

  - Added the required column `amount` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoicePdf` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceStatus` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceUrl` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planName` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planType` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."payments" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "invoicePdf" TEXT NOT NULL,
ADD COLUMN     "invoiceStatus" TEXT NOT NULL,
ADD COLUMN     "invoiceUrl" TEXT NOT NULL,
ADD COLUMN     "planName" TEXT NOT NULL,
ADD COLUMN     "planType" TEXT NOT NULL,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "subscriptionEnd" TIMESTAMP(3),
ADD COLUMN     "subscriptionStart" TIMESTAMP(3);
