import { User } from "../entities/user.entity";

export interface IUserRepository {
  findByEmail(email: string): Promise<User>
  getRoleByEmail(email: string): Promise<"WASTE_COLLECTOR" | "GENERATOR">
}
