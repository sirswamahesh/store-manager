import { BaseRepository } from "../../core/BaseRepository";
import { IUser } from "../user/user.interface";

export class AuthRepository extends BaseRepository<IUser> {
  constructor() {
    super("users");
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne("email", email);
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.update(userId, {
      lastLogin: new Date().toISOString(),
    } as Partial<IUser>);
  }
}
