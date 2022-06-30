import { Login, Logout, Register } from "../controllers/AdminController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/RefreshToken.js";
import { getOrders } from "../controllers/OrderController.js";
import express from "express";

const AdminRouter = express.Router();

AdminRouter.get("/", verifyToken, getOrders);
AdminRouter.post("/register", Register);
AdminRouter.post("/login",Login);
AdminRouter.get("/token", refreshToken);
AdminRouter.delete("/logout", Logout);


export default AdminRouter;