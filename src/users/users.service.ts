import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly repo: UserRepository) {}

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

    return { message: 'Signup successful, please login' };
  }

  updateUser(dto: UpdateUserDto) {
    return this.repo.updateUser(dto);
  }

  removeUser(dto) {
    return;
  }

  deleteUser(id: number) {
    return this.repo.deleteUser(id);
  }
}
