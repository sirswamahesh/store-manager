import express from "express";
import cors from "cors";
import tenantRoutes from "./modules/tenant/tenant.routes";
import shopRoutes from "./modules/shop/shop.routes";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import productRoutes from "./modules/product/product.routes";
import path from "path";
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// API Routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/tenant", tenantRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(errorHandler);

export default app;
