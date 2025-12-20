/*
  Warnings:

  - You are about to drop the column `balance_after` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `balance_before` on the `transactions` table. All the data in the column will be lost.
  - Added the required column `balanceAfter` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `balanceBefore` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "balance_after",
DROP COLUMN "balance_before",
ADD COLUMN     "balanceAfter" DECIMAL(18,2) NOT NULL,
ADD COLUMN     "balanceBefore" DECIMAL(18,2) NOT NULL;
