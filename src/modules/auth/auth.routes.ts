import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema } from "./auth.validation";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";

const router = Router();
const controller = new AuthController();

router.post("/login", validate(loginSchema), asyncHandler(controller.login));

export default router;
