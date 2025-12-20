import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

const UserResponse = {
  userId: true,
  avatar: true,
  name: true,
  email: true,
  telephone: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  passwordHash: false,
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
        status: true,
      },
    });
  }

  async findById(userId: number) {
    return await this.prisma.user.findUnique({
      where: { userId },
      select: { passwordHash: true, status: true },
    });
  }

  async findSession(userId: number) {}

  async saveRefreshToken(userId: number, token: string) {}

  async getUsers() {
    return await this.prisma.user.findMany({
      select: {
        ...UserResponse,
      },
    });
  }

  async getUser(id: number) {
    return await this.prisma.user.findUnique({
      where: { userId: id },
      select: {
        ...UserResponse,
      },
    });
  }

  async createUser(dto: CreateUserDto) {
    const hashedPassword = bcrypt.hashSync(dto.password, 10);

    const created = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        avatar: dto.avatar,
        telephone: dto.telephone,
        passwordHash: hashedPassword,
      },
      select: {
        name: true,
        email: true,
        avatar: true,
        telephone: true,
      },
    });

    return { message: 'Signup successful, please login', created };
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    let hashedPassword;
    if (dto.password) hashedPassword = bcrypt.hashSync(dto.password, 10);

    return await this.prisma.user.update({
      where: { userId: id },
      data: {
        name: dto.name,
        email: dto.email,
        avatar: dto.avatar,
        telephone: dto.telephone,
        passwordHash: hashedPassword,
      },
      select: {
        ...UserResponse,
      },
    });
  }

  async removeUser(id: number) {
    const removed = await this.prisma.user.update({
      where: { userId: id },
      data: { status: 'INACTIVE' },
      select: { userId: true, name: true, email: true },
    });

    return { status: 'User successfully removed', removed };
  }

  async deleteUser(id: number) {
    return await this.prisma.user.delete({ where: { userId: id } });
  }
}
