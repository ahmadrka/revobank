import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateAccountNumber } from 'src/helper/generateAccountNumber';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAccount(dto: CreateAccountDto, userId: number) {
    let accountNumber: string = '';
    let exists = true;

    while (exists) {
      accountNumber = generateAccountNumber();
      exists = !!(await this.prisma.account.findUnique({
        where: { accountNumber },
      }));
    }

    const pinHash = await bcrypt.hash(dto.pin.toString(), 10);

    return this.prisma.account.create({
      data: {
        accountName: dto.name,
        accountNumber,
        userId,
        pinHash,
        balance: 0,
        currency: dto.currency,
        accountType: dto.type,
      },
      select: {
        accountName: true,
        accountNumber: true,
        accountType: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async findAccounts(userId: number) {
    return await this.prisma.account.findMany({
      where: { userId: userId },
      select: {
        accountName: true,
        accountNumber: true,
        accountType: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async findAccount(accountNumber: string, userId: number) {
    return await this.prisma.account.findUnique({
      where: { accountNumber: accountNumber, userId: userId },
      select: {
        accountName: true,
        accountType: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async findAccountDetail(accountNumber: string, userId: number) {
    return await this.prisma.account.findUnique({
      where: { accountNumber: accountNumber, userId: userId },
      select: {
        accountId: false,
        userId: false,
        accountName: true,
        accountNumber: true,
        accountType: true,
        pinHash: false,
        balance: true,
        currency: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        closedAt: true,
      },
    });
  }

  async findByAccountNumber(accountNumber: string, userId: number) {
    return await this.prisma.account.findUnique({
      where: { accountNumber: accountNumber, userId: userId },
      select: {
        accountId: true,
        userId: true,
        accountName: true,
        accountNumber: true,
        accountType: true,
        pinHash: true,
        pinFailedAttempts: true,
        pinLockedUntil: true,
        balance: true,
        currency: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        closedAt: true,
      },
    });
  }

  async findByAccountNumberPublic(accountNumber: string) {
    return await this.prisma.account.findUnique({
      where: { accountNumber: accountNumber },
      // select: {
      //   accountId: true,
      //   userId: true,
      //   accountName: true,
      //   accountNumber: true,
      //   accountType: true,
      //   pinHash: true,
      //   pinFailedAttempts: true,
      //   pinLockedUntil: true,
      //   balance: true,
      //   currency: true,
      //   status: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   closedAt: true,
      // },
    });
  }

  async hasActiveAccount(userId: number): Promise<boolean> {
    return !!(await this.prisma.account.findFirst({
      where: {
        userId,
        status: 'ACTIVE',
      },
      select: { accountId: true },
    }));
  }
}
