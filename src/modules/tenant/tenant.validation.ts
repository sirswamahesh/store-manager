import Joi from "joi";

export const createTenantSchema = Joi.object({
  tenantName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Tenant name is required",
    "string.min": "Tenant name must be at least 3 characters",
    "any.required": "Tenant name is required",
  }),

  tenantEmail: Joi.string().email().required().messages({
    "string.email": "Invalid tenant email format",
    "string.empty": "Tenant email is required",
    "any.required": "Tenant email is required",
  }),

  adminName: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Admin name is required",
    "string.min": "Admin name must be at least 3 characters",
    "any.required": "Admin name is required",
  }),

  adminEmail: Joi.string().email().required().messages({
    "string.email": "Invalid admin email format",
    "string.empty": "Admin email is required",
    "any.required": "Admin email is required",
  }),
});
