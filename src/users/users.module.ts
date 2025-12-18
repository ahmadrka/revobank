import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserSessionRepository } from './user-sessions.repository';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserSessionRepository],
  exports: [UsersService, UserSessionRepository],
})
export class UsersModule {}
