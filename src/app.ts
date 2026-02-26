import express from "express";
import cors from "cors";
import tenantRoutes from "./modules/tenant/tenant.routes";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";

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
app.use("/api/v1/tenant", tenantRoutes);
app.use("/api/v1/auth", authRoutes);
app.use(errorHandler);

export default app;
