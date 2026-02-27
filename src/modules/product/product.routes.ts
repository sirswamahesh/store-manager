import express from "express";
import { ProductController } from "./product.controller";
import { upload } from "../../middlewares/upload.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createProductSchema } from "./product.validation";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { authorizeRoles } from "../../middlewares/role.middleware";
import { ROLE } from "../../utils/roles";
import { asyncHandler } from "../../middlewares/asyncHandler.middleware";

const router = express.Router();
const controller = new ProductController();

router.post(
  "/create",
  authMiddleware,
  authorizeRoles(ROLE.ADMIN, ROLE.USER),
  upload.single("image"),
  validate(createProductSchema),
  asyncHandler(controller.createProduct),
);

router.get(
  "/",
  authMiddleware,
  authorizeRoles(ROLE.SUPER_ADMIN, ROLE.ADMIN, ROLE.USER),
  asyncHandler(controller.getProducts),
);

export default router;
