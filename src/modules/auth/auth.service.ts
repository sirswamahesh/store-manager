import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { LoginDTO, JwtPayload } from "./auth.types";
import { AppError } from "../../core/AppError";
import { HTTP_STATUS } from "../../utils/httpStatus";

const JWT_SECRET = process.env.JWT_SECRET! as string;

export class AuthService {
  private repository = new AuthRepository();

  async login(payload: LoginDTO) {
    const user: any = await this.repository.findByEmail(payload.email);

    if (!user) {
      throw new AppError("Invalid email or PIN", HTTP_STATUS.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new AppError("Account is inactive", HTTP_STATUS.FORBIDDEN);
    }

    const isMatch = await bcrypt.compare(payload.pin, user.pin);

    if (!isMatch) {
      throw new AppError("Invalid email or PIN", HTTP_STATUS.UNAUTHORIZED);
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        tenantId: user.tenantId ?? null,
        shopId: user.shopId ?? null,
      } as JwtPayload,
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId ?? null,
        shopId: user.shopId ?? null,
      },
    };
  }
}
