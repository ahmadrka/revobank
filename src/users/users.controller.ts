import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles, Role } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get('getall')
  findAll() {
    return this.usersService.getUsers();
  }

  @Get()
  findOne(@Req() user: { user: { userId: number } }) {
    return this.usersService.getUser(+user.user.userId);
  }

  @Patch()
  update(
    @Req() user: { user: { userId: number } },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(+user.user.userId, updateUserDto);
  }

  @Patch('close')
  remove(
    @Req() user: { user: { userId: number } },
    @Body('password') password: string,
  ) {
    return this.usersService.removeUser(+user.user.userId, password);
  }

  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
