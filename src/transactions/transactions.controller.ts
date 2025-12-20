import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { TransferDto } from './dto/transfer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get(':accountNumber/histories')
  findHistories(
    @Param('accountNumber') accountNumber: string,
    @Req() req: { user: { userId: number } },
  ) {
    return this.transactionsService.findHistories(
      accountNumber,
      req.user.userId,
    );
  }

  @Get(':accountNumber/histories/:id')
  findHistory(
    @Param('id') id: number,
    @Param('accountNumber') accountNumber: string,
    @Req() req: { user: { userId: number } },
  ) {
    return this.transactionsService.findHistory(
      id,
      accountNumber,
      req.user.userId,
    );
  }

  @Post(':accountNumber/deposit')
  deposit(
    @Param('accountNumber') accountNumber: string,
    @Body() deposit: DepositDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.transactionsService.deposit(
      deposit,
      accountNumber,
      req.user.userId,
    );
  }

  @Post(':accountNumber/withdraw')
  withdraw(
    @Param('accountNumber') accountNumber: string,
    @Body() withdraw: WithdrawDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.transactionsService.withdraw(
      withdraw,
      accountNumber,
      req.user.userId,
    );
  }

  @Post(':accountNumber/transfer')
  transfer(
    @Param('accountNumber') accountNumber: string,
    @Body() transfer: TransferDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.transactionsService.transfer(
      transfer,
      accountNumber,
      req.user.userId,
    );
  }
}
