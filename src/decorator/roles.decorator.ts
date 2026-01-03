import { SetMetadata } from '@nestjs/common';

export enum Role {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
