import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "./auth.repository";
import { LoginDTO, TokenPayload } from "./auth.types";
import { IAuthResponse } from "./auth.interface";
import { AppError } from "../../core/AppError";

const JWT_SECRET = process.env.JWT_SECRET!;
const TOKEN_EXPIRY = "1d";
export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async login(credentials: LoginDTO): Promise<IAuthResponse> {
    const user = await this.repository.findByEmail(credentials.email);
    if (!user) {
      throw new AppError("Invalid email or PIN", 401);
    }

    if (!user.isActive) {
      throw new AppError("Account is inactive", 403);
    }

    const isPinValid = await bcrypt.compare(credentials.pin, user.pin);
    if (!isPinValid) {
      throw new AppError("Invalid email or PIN", 401);
    }

    await this.repository.updateLastLogin(user.id);

    const token = this.generateToken({
      id: user.id,
      role: user.role,
      tenantId: user.tenantId || null,
      shopId: user.shopId || null,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId || null,
        shopId: user.shopId || null,
        name: user.name,
      },
    };
  }

  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY,
    });
  }
}
