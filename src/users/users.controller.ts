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
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles, Role } from 'src/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { OwnershipGuard } from 'src/auth/ownership.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  @Get()
  findAll() {
    return this.usersService.getUsers();
  }

  @UseGuards(OwnershipGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getUser(+id);
  }

  @UseGuards(OwnershipGuard)
  @Patch(':id')
  update(@Param('id') @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }

  @UseGuards(OwnershipGuard)
  @Post(':id')
  remove(@Param('id') @Body('password') removeUser) {
    return this.usersService.removeUser(removeUser);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.usersService.deleteUser(+id);
  }
}
