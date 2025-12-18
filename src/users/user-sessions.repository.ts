import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserSessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(data: {
    userId: number;
    refreshTokenHash: string;
    expiresAt: Date;
    userAgent?: string;
    ipAddress?: string;
  }) {
    return this.prisma.userSession.create({
      data,
    });
  }

  async findByUserId(userId: number) {
    return this.prisma.userSession.findMany({
      where: { userId },
    });
  }

  async findByRefreshToken(userId: number, refreshTokenHash: string) {
    return this.prisma.userSession.findFirst({
      where: {
        userId,
        refreshTokenHash,
      },
    });
  }

  async deleteSession(sessionId: number) {
    return this.prisma.userSession.delete({
      where: { sessionId },
    });
  }

  async deleteAllUserSessions(userId: number) {
    return this.prisma.userSession.deleteMany({
      where: { userId },
    });
  }
}
