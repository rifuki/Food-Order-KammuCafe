import express from "express";
import { getProducts, getProductById, insertProduct, deleteProduct, updateProduct, getProductCategory } from "../controllers/ProductController.js";
import { verifyToken } from "../middleware/VerifyToken.js";


const ProductRouter = express.Router();
ProductRouter.get("/category/", getProductCategory);
ProductRouter.get("/", getProducts);
ProductRouter.get("/:id", getProductById)
ProductRouter.post("/", insertProduct);
ProductRouter.patch("/:id", updateProduct);
ProductRouter.delete("/:id", deleteProduct);

ProductRouter.use((req, res) => {
    res.status(404).send("404 NOT FOUND");
})

export default ProductRouter;