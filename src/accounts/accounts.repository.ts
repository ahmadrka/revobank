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
        accountNumber,
        userId,
        pinHash,
        balance: 0,
        currency: dto.currency,
        accountType: dto.type,
      },
      select: {
        accountNumber: true,
        balance: true,
        createdAt: true,
      },
    });
  }

  async findAccounts(userId: number) {
    return await this.prisma.account.findMany({
      where: { userId: userId },
      select: {
        accountNumber: true,
        status: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  async findAccount(accountNumber: string, userId: number) {
    return await this.prisma.account.findUnique({
      where: { accountNumber: accountNumber, userId: userId },
      select: {
        accountId: false,
        userId: false,
        accountNumber: true,
        accountType: false,
        pinHash: false,
        balance: false,
        currency: false,
        status: true,
        createdAt: true,
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
        accountNumber: true,
        accountType: true,
        pinHash: false,
        balance: true,
        currency: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findByAccountNumber(accountNumber: string, userId: number) {
    return await this.prisma.account.findUnique({
      where: { accountNumber: accountNumber, userId: userId },
      select: { pinHash: true },
    });
  }
}
