import { Request, Response } from "express";
import { BaseController } from "../../core/BaseController";
import { AuthService } from "./auth.service";

export class AuthController extends BaseController {
  private service = new AuthService();

  login = async (req: Request, res: Response) => {
    const data = await this.service.login(req.body);
    return this.ok(res, "Login successful", data);
  };
}
