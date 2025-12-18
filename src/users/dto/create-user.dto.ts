import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9_ ]+$/, {
    message: 'Name only letter, number and space',
  })
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telephone: string | null;

  @IsOptional()
  @IsString()
  avatar: string;

  @IsString()
  @IsNotEmpty({ message: 'Please input password' })
  password: string;
}
