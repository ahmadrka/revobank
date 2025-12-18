import { User } from '../entities/user.entity';

export interface IUserRepository {
  getUser(id: number): User;
  updateUser(id: number, data: Partial<User>): User;
}
