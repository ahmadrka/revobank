import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AccountsModule } from './accounts/accounts.module';
import { MorganMiddleware } from './middleware/logger.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { TransactionsModule } from './transactions/transactions.module';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    AccountsModule,
    PrismaModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RateLimiterMiddleware).forRoutes('*');
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
