import express from "express";
import { adminController } from "../controllers/adminController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/adminAuth.js";

export const adminRouter = express.Router();

// All admin routes require authentication + admin role
adminRouter.use(requireAuth, requireAdmin);

adminRouter.get("/stats", adminController.getStats);
adminRouter.get("/users", adminController.getAllUsers);
adminRouter.put("/users/:id/role", adminController.updateUserRole);
adminRouter.put("/users/:id/ban", adminController.toggleUserBan);
adminRouter.delete("/users/:id", adminController.deleteUser);
adminRouter.post("/trainers", adminController.createTrainer);
adminRouter.put("/trainers/:id", adminController.updateTrainer);
adminRouter.delete("/trainers/:id", adminController.deleteTrainer);
adminRouter.post("/classes", adminController.createClass);
adminRouter.put("/classes/:id", adminController.updateClass);
adminRouter.delete("/classes/:id", adminController.deleteClass);
