import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),

  pin: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "PIN must be 6 digits",
      "string.pattern.base": "PIN must contain only numbers",
      "any.required": "PIN is required",
    }),
});
