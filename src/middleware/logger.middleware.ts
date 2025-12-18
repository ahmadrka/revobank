import { Injectable, NestMiddleware } from '@nestjs/common';
import morgan from 'morgan';

@Injectable()
export class MorganMiddleware implements NestMiddleware {
  private logger = morgan('dev');

  use(req: any, res: any, next: () => void) {
    this.logger(req, res, next);
  }
}
