import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please input password' })
  password: string;
}
