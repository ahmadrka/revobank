import { AccountRepository } from './accounts.repository';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AccountsService {
  constructor(private readonly repo: AccountRepository) {}

  async createAccount(dto: CreateAccountDto, userId: number) {
    return this.repo.createAccount(dto, userId);
  }

  async findAccounts(userId: number) {
    return await this.repo.findAccounts(userId);
  }

  async findAccount(accountNumber: string, userId: number) {
    const account = await this.repo.findAccount(accountNumber, userId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async findAccountDetail(accountNumber: string, userId: number, pin: string) {
    const accountData = await this.repo.findByAccountNumber(
      accountNumber,
      userId,
    );

    if (!accountData?.pinHash) {
      throw new NotFoundException('Account not found');
    }

    const isMatch = await bcrypt.compare(pin, accountData.pinHash);

    if (!isMatch) {
      throw new ForbiddenException('Pin not valid');
    }

    return await this.repo.findAccountDetail(accountNumber, userId);
  }

  updateAccount(number: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${number} account`;
  }

  removeAccount(number: number, pin: number) {
    return `This action removes a #${number}${pin} account`;
  }

  deleteAccount(number: number, pin: number) {}
}
