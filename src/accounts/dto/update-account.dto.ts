import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto, Currency, AccountType } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  currentPin: string;
  newPin: string;
  accountType: AccountType;
  currency: Currency;
}
