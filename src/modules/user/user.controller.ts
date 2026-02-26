import { Request, Response } from "express";
import { UserService } from "./user.service";

export class UserController {
  private userService = new UserService();

  async create(req: Request, res: Response) {
    const user = await this.userService.createUser(req.body);
    res.status(201).json(user);
  }
}
