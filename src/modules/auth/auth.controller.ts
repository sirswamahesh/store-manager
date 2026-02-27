import { Request, Response } from "express";
import { BaseController } from "../../core/BaseController";
import { AuthService } from "./auth.service";

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super(null as any);
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const result = await this.authService.login(req.body);
      return this.ok(res, "Login successful", result);
    } catch (error) {
      return this.error(res, error);
    }
  };
}
