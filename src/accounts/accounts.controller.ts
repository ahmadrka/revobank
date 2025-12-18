import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnershipGuard } from 'src/auth/ownership.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @Req() req: { user: { userId: number } },
  ) {
    return this.accountsService.createAccount(
      createAccountDto,
      req.user.userId,
    );
  }

  @Get()
  findManyAccounts(@Req() req: { user: { userId: number } }) {
    return this.accountsService.findAccounts(req.user.userId);
  }

  @Get(':accountNumber')
  findOneAccount(
    @Param('accountNumber') accountNumber: string,
    @Req() req: { user: { userId: number } },
  ) {
    return this.accountsService.findAccount(accountNumber, req.user.userId);
  }

  @Post(':accountNumber/detail')
  findOneDetail(
    @Param('accountNumber') accountNumber: string,
    @Body('pin') pin: string,
    @Req() req: { user: { userId: number } },
  ) {
    return this.accountsService.findAccountDetail(
      accountNumber,
      req.user.userId,
      pin,
    );
  }

  @UseGuards(OwnershipGuard)
  @Patch(':accountNumber')
  update(
    @Param('accountNumber') accountNumber: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(+accountNumber, updateAccountDto);
  }

  @UseGuards(OwnershipGuard)
  @Post(':accountNumber/close')
  remove(
    @Param('accountNumber') accountNumber: string,
    @Body('pin') pin: string,
  ) {
    return this.accountsService.removeAccount(+accountNumber, +pin);
  }

  @UseGuards(OwnershipGuard)
  @Delete(':accountNumber')
  delete(
    @Param('accountNumber') accountNumber: string,
    @Body('pin') pin: string,
  ) {
    return this.accountsService.deleteAccount(+accountNumber, +pin);
  }
}
