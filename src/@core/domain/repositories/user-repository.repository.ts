import { User } from '../entities/user.entity';

export type UserRole = 'WASTE_COLLECTOR' | 'GENERATOR' | 'DELIVERYMAN';

export type AuthenticatedIdentity = {
  userId: string;
  role: UserRole;
  generatorId?: string;
  collectorId?: string;
  deliverymanId?: string;
  ownerCollectorId?: string;
};

export interface IUserRepository {
  findByEmail(email: string): Promise<User>;
  getRoleByEmail(email: string): Promise<UserRole>;
  resolveAuthenticatedIdentity(profileId: string): Promise<AuthenticatedIdentity | null>;
}
