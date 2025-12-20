import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED',
}

export class TransactionDto {
  @IsString()
  @Length(6, 6)
  @Matches(/^\d+$/, { message: 'PIN must be numeric' })
  pin: string;

  @IsOptional()
  @IsString()
  targetAccount?: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;
}
