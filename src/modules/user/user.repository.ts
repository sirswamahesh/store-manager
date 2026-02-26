import { BaseRepository } from "../../core/BaseRepository";
import { IUser } from "./user.interface";

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super("users");
  }
}
