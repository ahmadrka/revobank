import { Injectable, NotFoundException } from '@nestjs/common';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountRepository } from 'src/accounts/accounts.repository';

@Injectable()
export class TransactionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly account: AccountRepository,
  ) {}

  async findHistories(accountNumber: string, userId: number) {
    const accountId = await this.account.findByAccountNumber(
      accountNumber,
      userId,
    );

    if (!accountId) throw new NotFoundException('Account not found');

    return this.prisma.transaction.findMany({
      where: { accountId: accountId.accountId },
    });
  }

  async findHistory(id: number, accountNumber: string, userId: number) {
    const account = await this.account.findByAccountNumber(
      accountNumber,
      userId,
    );

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    const history = await this.prisma.transaction.findUnique({
      where: {
        transactionId: id,
        accountId: account.accountId,
      },
    });

    if (!history) {
      throw new NotFoundException('History not found');
    }

    return history;
  }

  async deposit(
    accountId: number,
    amount: number,
    balanceBefore: number,
    description: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.update({
        where: { accountId },
        data: {
          balance: { increment: amount },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          transactionType: 'DEPOSIT',
          amount,
          accountId,
          balanceBefore,
          balanceAfter: account.balance,
          description,
        },
      });

      return transaction;
    });
  }

  async withdraw(
    accountId: number,
    amount: number,
    balanceBefore: number,
    description: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.account.update({
        where: { accountId },
        data: {
          balance: { decrement: amount },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          transactionType: 'WITHDRAW',
          amount,
          accountId: accountId,
          balanceBefore,
          balanceAfter: account.balance,
          description,
        },
      });

      return transaction;
    });
  }

  async transfer(
    sourceId: number,
    targetId: number,
    amount: number,
    balanceBefore: number,
    description: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const source = await tx.account.update({
        where: { accountId: sourceId },
        data: {
          balance: { decrement: amount },
        },
      });

      const target = await tx.account.update({
        where: { accountId: targetId },
        data: {
          balance: { increment: amount },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          transactionType: 'TRANSFER',
          amount,
          accountId: sourceId,
          targetAccountId: targetId,
          balanceBefore,
          balanceAfter: source.balance,
          description,
        },
      });

      return transaction;
    });
  }
}
