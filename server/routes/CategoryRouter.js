import express from "express";
import { getCategories } from "../controllers/CategoryController.js";

const CategoryRouter = express.Router();

CategoryRouter.get("/", getCategories);
// CategoryRouter.get("/get/", getCategory);

export default CategoryRouter;