import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface RateRecord {
  count: number;
  timestamp: number;
}

const WINDOW = 10 * 10000; // 10 seconds
const MAX_REQUESTS = 5;

const store = new Map<string, RateRecord>();

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = store.get(ip);

    // 1️⃣ Belum ada record
    if (!record) {
      store.set(ip, { count: 1, timestamp: now });
      return next();
    }

    // 2️⃣ Window sudah lewat → reset
    if (now - record.timestamp > WINDOW) {
      store.set(ip, { count: 1, timestamp: now });
      return next();
    }

    // 3️⃣ Masih dalam window → increment
    record.count += 1;

    // 4️⃣ Cek limit
    if (record.count > MAX_REQUESTS) {
      return res.status(429).json({
        message: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((WINDOW - (now - record.timestamp)) / 1000),
      });
    }

    next();
  }
}
