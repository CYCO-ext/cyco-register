import { UserRole } from '../../../domain/repositories/user-repository.repository';

export type TSessionOutputDTO = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: UserRole;
  token: string;
};
