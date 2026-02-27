import Joi from "joi";
import { CreateShopDTO } from "./shop.types";

export const createShopSchema = Joi.object<CreateShopDTO>({
  name: Joi.string().min(3).max(150).required().messages({
    "string.empty": "Shop name is required",
    "string.min": "Shop name must be at least 3 characters",
    "any.required": "Shop name is required",
  }),
  ownerName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Owner name is required",
    "string.min": "Owner name must be at least 3 characters",
    "any.required": "Owner name is required",
  }),
  ownerEmail: Joi.string().email().required().messages({
    "string.email": "Invalid owner email format",
    "string.empty": "Owner email is required",
    "any.required": "Owner email is required",
  }),
});
