import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { TransactionsRepository } from './transactions.repository';
import { AccountRepository } from 'src/accounts/accounts.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly repo: TransactionsRepository,
    private readonly account: AccountRepository,
  ) {}

  findHistories(accountNumber: string, userId: number) {
    return this.repo.findHistories(accountNumber, userId);
  }

  findHistory(id: number, accountNumber: string, userId: number) {
    return this.repo.findHistory(id, accountNumber, userId);
  }

  async deposit(dto: DepositDto, accountNumber: string, userId: number) {
    const account = await this.account.findByAccountNumber(
      accountNumber,
      userId,
    );

    if (!account || !account.pinHash)
      throw new NotFoundException('Account not found');

    const isMatch = await bcrypt.compare(dto.pin, account.pinHash);
    if (!isMatch) throw new ForbiddenException('Invalid PIN');

    if (account.status !== 'ACTIVE')
      throw new ForbiddenException('Account inactive');

    if (dto.amount <= 0) throw new BadRequestException('Invalid amount');

    return this.repo.deposit(
      account.accountId,
      dto.amount,
      account.balance.toNumber(),
      dto.description || '',
    );
  }

  async withdraw(dto: WithdrawDto, accountNumber: string, userId: number) {
    const account = await this.account.findByAccountNumber(
      accountNumber,
      userId,
    );

    if (!account || !account.pinHash)
      throw new NotFoundException('Account not found');

    const isMatch = await bcrypt.compare(dto.pin, account.pinHash);
    if (!isMatch) throw new ForbiddenException('Invalid PIN');

    if (account.status !== 'ACTIVE')
      throw new ForbiddenException('Account inactive');

    if (dto.amount <= 0) throw new BadRequestException('Invalid amount');

    if (account.balance.toNumber() < dto.amount)
      throw new ForbiddenException('Insufficient balance');

    return this.repo.withdraw(
      account.accountId,
      dto.amount,
      account.balance.toNumber(),
      dto.description || '',
    );
  }

  async transfer(dto: TransferDto, accountNumber: string, userId: number) {
    const source = await this.account.findByAccountNumber(
      accountNumber,
      userId,
    );

    if (!source || !source.pinHash)
      throw new NotFoundException('Account not found');

    if (!dto.targetAccount)
      throw new BadRequestException('Target account is required');

    if (dto.targetAccount === accountNumber)
      throw new BadRequestException('Cannot transfer to same account');

    const isMatch = await bcrypt.compare(dto.pin, source.pinHash);
    if (!isMatch) throw new ForbiddenException('Invalid PIN');

    if (source.status !== 'ACTIVE')
      throw new ForbiddenException('Account inactive');

    if (source.balance.toNumber() < dto.amount)
      throw new ForbiddenException('Insufficient balance');

    const target = await this.account.findByAccountNumberPublic(
      dto.targetAccount,
    );

    if (!target) throw new NotFoundException('Target account not found');

    if (target.status !== 'ACTIVE')
      throw new ForbiddenException('Target account inactive');

    return this.repo.transfer(
      source.accountId,
      target.accountId,
      dto.amount,
      source.balance.toNumber(),
      dto.description || '',
    );
  }
}
