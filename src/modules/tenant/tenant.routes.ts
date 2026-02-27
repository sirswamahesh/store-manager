import express from "express";
import { TenantController } from "./tenant.controller";
import { validate } from "../../middlewares/validate.middleware";
import { createTenantSchema, tenantIdSchema } from "./tenant.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { UserRole } from "../../utils/roles";

const router = express.Router();
const controller = new TenantController();

router.post(
  "/create",
  authMiddleware,
  authorizeRoles(UserRole.SUPER_ADMIN),
  validate(createTenantSchema),
  asyncHandler(controller.createTenant),
);

router.get(
  "/all",
  authMiddleware,
  authorizeRoles(UserRole.SUPER_ADMIN),
  asyncHandler(controller.getAllTenants),
);

router.get(
  "/:id",
  authMiddleware,
  authorizeRoles(UserRole.SUPER_ADMIN),
  validate(tenantIdSchema),
  asyncHandler(controller.getTenantById),
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles(UserRole.SUPER_ADMIN),
  validate(tenantIdSchema),
  asyncHandler(controller.updateTenant),
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles(UserRole.SUPER_ADMIN),
  validate(tenantIdSchema),
  asyncHandler(controller.deactivateTenant),
);

router.get(
  "/my-tenant",
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(controller.getTenantById),
);

router.put(
  "/my-tenant",
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(controller.updateTenant),
);

export default router;
