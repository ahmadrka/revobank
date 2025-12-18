import { IsEnum, IsString, Length, Matches } from 'class-validator';

enum AccountType {
  SAVING = 'SAVING',
  DEPOSIT = 'DEPOSIT',
  BUSINESS = 'BUSINESS',
}

enum Currency {
  USD = 'USD',
  IDR = 'IDR',
}

export class CreateAccountDto {
  @IsEnum(AccountType)
  type: AccountType;

  @IsString()
  @Length(6, 6)
  @Matches(/^\d+$/, { message: 'PIN must be numeric' })
  pin: string;

  @IsEnum(Currency)
  currency: Currency;
}
