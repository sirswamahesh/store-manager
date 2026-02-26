import express from "express";
import { TenantController } from "./tenant.controller";
import { validate } from "../../middlewares/validate.middleware";
import { createTenantSchema } from "./tenant.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";

const router = express.Router();
const controller = new TenantController();

router.post(
  "/",
  authMiddleware,
  authorizeRoles("SUPER_ADMIN"),
  asyncHandler(controller.createTenant),
);
router.post(
  "/create",
  authMiddleware,
  authorizeRoles("SUPER_ADMIN"),
  validate(createTenantSchema),
  asyncHandler(controller.createTenant),
);

export default router;
