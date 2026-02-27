import { Request, Response } from "express";
import { BaseController } from "../../core/BaseController";
import { ProductService } from "./product.service";
import { AppError } from "../../core/AppError";
import { HTTP_STATUS } from "../../utils/httpStatus";

export class ProductController extends BaseController {
  private service = new ProductService();

  createProduct = async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError("Product image is required", HTTP_STATUS.BAD_REQUEST);
    }

    const BASE_URL = process.env.BASE_URL;

    if (!BASE_URL) {
      throw new AppError(
        "Base URL not configured",
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
      );
    }

    const imageUrl = `${BASE_URL}/uploads/products/${req.file.filename}`;

    const result = await this.service.createProduct(req.user, {
      ...req.body,
      imageUrl,
    });

    return this.created(res, "Product created successfully", result);
  };
  getProducts = async (req: Request, res: Response) => {
    const { shopId } = req.query;

    const result = await this.service.getProducts(req.user, shopId as string);

    return this.ok(res, "Products fetched successfully", result);
  };
}
