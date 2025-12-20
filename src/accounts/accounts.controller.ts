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
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles, Role } from 'src/decorator/roles.decorator';

@Controller('accounts')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Roles(Role.USER)
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

  @Roles(Role.USER)
  @Get()
  findManyAccounts(@Req() req: { user: { userId: number } }) {
    return this.accountsService.findAccounts(req.user.userId);
  }

  @Roles(Role.USER)
  @Get(':accountNumber')
  findOneAccount(
    @Param('accountNumber') accountNumber: string,
    @Req() req: { user: { userId: number } },
  ) {
    return this.accountsService.findAccount(accountNumber, req.user.userId);
  }

  @Roles(Role.USER)
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

  @Roles(Role.USER)
  @Patch(':accountNumber')
  update(
    @Param('accountNumber') accountNumber: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    return this.accountsService.updateAccount(+accountNumber, updateAccountDto);
  }

  @Roles(Role.USER)
  @Post(':accountNumber/close')
  remove(
    @Param('accountNumber') accountNumber: string,
    @Body('pin') pin: string,
  ) {
    return this.accountsService.removeAccount(+accountNumber, +pin);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':accountNumber')
  delete(
    @Param('accountNumber') accountNumber: string,
    @Body('pin') pin: string,
  ) {
    return this.accountsService.deleteAccount(+accountNumber, +pin);
  }
}
