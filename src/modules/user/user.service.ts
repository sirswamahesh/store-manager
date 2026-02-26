import { UserRepository } from "./user.repository";
import { IUser } from "./user.interface";

export class UserService {
  private userRepo = new UserRepository();

  async createUser(data: IUser) {
    // return this.userRepo.create({
    //   ...data,
    //   createdAt: new Date(),
    // });
  }
}
