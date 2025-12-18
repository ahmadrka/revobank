import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Only letter, number and underscore' })
  name: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telephone: string | null;

  @IsOptional()
  @IsString()
  password: string;
}
