import { UsersService } from 'src/users/users.service';
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import type { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly UsersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  login(@Body() dto: LoginAuthDto, @Req() req: Request) {
    return this.authService.login(dto, {
      ip: req.ip,
      ua: req.headers['user-agent'],
    });
  }

  @Post('signup')
  create(@Body() dto: CreateUserDto) {
    return this.UsersService.createUser(dto);
  }

  @Post('refresh')
  refresh(@Body('refresh_token') token: string) {
    return this.authService.refresh(token);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req, @Res() res) {
    const token = await this.authService.loginOAuth(req.user);
    return res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
  }

  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuth() {}

  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftCallback(@Req() req, @Res() res) {
    const token = await this.authService.loginOAuth(req.user);
    return res.redirect(`${process.env.FRONTEND_URL}/oauth?token=${token}`);
  }
}
