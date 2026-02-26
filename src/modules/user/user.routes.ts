import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();
const controller = new UserController();

router.post("/", controller.create.bind(controller));

export default router;
