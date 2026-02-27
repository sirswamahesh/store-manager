import express from "express";
import { ShopController } from "./shop.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createShopSchema } from "./shop.validation";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";
import { UserRole } from "../../utils/roles";

const router = express.Router();
const controller = new ShopController();

// GET /shops - Get shops based on role
router.get(
  "/",
  authMiddleware,
  authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  asyncHandler(controller.getShops),
);

// GET /shops/:id - Get shop by ID
router.get(
  "/:id",
  authMiddleware,
  authorizeRoles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.USER),
  asyncHandler(controller.getShopById),
);

// POST /shops/create - Create shop (Admin only)
router.post(
  "/create",
  authMiddleware,
  authorizeRoles(UserRole.ADMIN),
  validate(createShopSchema),
  asyncHandler(controller.createShop),
);

export default router;
