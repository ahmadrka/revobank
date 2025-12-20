import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const paramId = Number(req.params.id);

    // if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') return true;
    return user.userId === paramId;
  }
}
