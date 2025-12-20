import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountRepository } from 'src/accounts/accounts.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UserRepository,
    private readonly account: AccountRepository,
  ) {}

  async findByEmail(email: string) {
    return await this.repo.findByEmail(email);
  }

  async findSession(userId: number) {
    return await this.findSession(userId);
  }

  async saveRefreshToken(userId: number, token: string) {
    return await this.repo.saveRefreshToken(userId, token);
  }

  async getUsers() {
    return await this.repo.getUsers();
  }

  async getUser(id: number) {
    return await this.repo.getUser(id);
  }

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.repo.findByEmail(dto.email);
    if (existingUser) throw new ConflictException('Email already exists');

    return this.repo.createUser(dto);
  }

  updateUser(id: number, dto: UpdateUserDto) {
    return this.repo.updateUser(id, dto);
  }

  async removeUser(id: number, password: string) {
    const user = await this.repo.findById(id);
    const hasActiveAccount = await this.account.hasActiveAccount(id);

    if (!user || user.status === 'INACTIVE')
      throw new NotFoundException('User already removed');

    const matches = await bcrypt.compare(password, user.passwordHash);

    if (!matches) throw new ForbiddenException('Invalid password');

    if (hasActiveAccount)
      throw new ForbiddenException(
        'Please close or transfer ownership of this user account before deleting this user',
      );

    return this.repo.removeUser(id);
  }

  deleteUser(id: number) {
    return this.repo.deleteUser(id);
  }
}
