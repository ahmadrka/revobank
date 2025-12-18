import { UsersService } from 'src/users/users.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UserSessionRepository } from 'src/users/user-sessions.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly UsersService: UsersService,
    private readonly UserSessions: UserSessionRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginAuthDto, meta: { ip?: string; ua?: string }) {
    const user = await this.UsersService.findByEmail(dto.email);
    if (!user) return new UnauthorizedException('Email not found');

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) return new UnauthorizedException('Invalid password');

    const payload = { sub: user.userId, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.userId, type: 'refresh' },
      { expiresIn: '7d' },
    );

    await this.UserSessions.createSession({
      userId: user.userId,
      refreshTokenHash: await bcrypt.hash(refreshToken, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: meta.ip,
      userAgent: meta.ua,
    });

    const { passwordHash, ...safeUser } = user;

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: safeUser,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const sessions = await this.UserSessions.findByUserId(payload.sub);

      const matchedSession = await Promise.all(
        sessions.map(async (s) => ({
          session: s,
          match: await bcrypt.compare(refreshToken, s.refreshTokenHash),
        })),
      ).then((res) => res.find((r) => r.match));

      if (!matchedSession) {
        return new UnauthorizedException('Refresh token revoked');
      }

      if (matchedSession.session.expiresAt < new Date()) {
        return new UnauthorizedException('Session expired');
      }

      // ROTATE
      await this.UserSessions.deleteSession(matchedSession.session.sessionId);

      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub },
        { expiresIn: '15m' },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: payload.sub, type: 'refresh' },
        { expiresIn: '7d' },
      );

      await this.UserSessions.createSession({
        userId: payload.sub,
        refreshTokenHash: await bcrypt.hash(newRefreshToken, 10),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
