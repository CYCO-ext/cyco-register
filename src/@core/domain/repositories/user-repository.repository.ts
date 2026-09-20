import { User } from '../entities/user.entity';

export type UserRole = 'WASTE_COLLECTOR' | 'GENERATOR' | 'DELIVERYMAN';

export interface IUserRepository {
  findByEmail(email: string): Promise<User>;
  getRoleByEmail(email: string): Promise<UserRole>;
}
