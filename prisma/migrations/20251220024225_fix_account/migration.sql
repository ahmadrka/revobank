/*
  Warnings:

  - Made the column `pin_hash` on table `accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "pin_hash" SET NOT NULL;
