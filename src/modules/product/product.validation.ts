import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    "string.base": "Product name must be a string",
    "string.empty": "Product name cannot be empty",
    "string.min": "Product name must be at least 3 characters",
    "any.required": "Product name is required",
  }),

  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a number",
    "number.min": "Price cannot be negative",
    "any.required": "Price is required",
  }),

  category: Joi.string().min(3).required().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name cannot be empty",
    "string.min": "Category name must be at least 3 characters",
    "any.required": "Category name is required",
  }),

  stock: Joi.number().min(0).optional().messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
  }),
});
