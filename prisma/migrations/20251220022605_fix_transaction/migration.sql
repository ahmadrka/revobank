/*
  Warnings:

  - You are about to drop the column `balanceAfter` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `balanceBefore` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `balance_after` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balance_before` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "balanceAfter",
DROP COLUMN "balanceBefore",
ADD COLUMN     "balance_after" DECIMAL(18,2) NOT NULL,
ADD COLUMN     "balance_before" DECIMAL(18,2) NOT NULL;
