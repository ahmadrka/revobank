/*
  Warnings:

  - You are about to alter the column `account_number` on the `accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(12)`.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "account_name" VARCHAR(100),
ADD COLUMN     "closed_at" TIMESTAMP(3),
ADD COLUMN     "pin_failed_attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pin_locked_until" TIMESTAMP(3),
ALTER COLUMN "account_number" SET DATA TYPE VARCHAR(12),
ALTER COLUMN "currency" SET DEFAULT 'USD';
