import express from "express";
import {getCartProductById, getCart, insertCart, updateCart } from "../controllers/CartController.js";

const CartRouter = express.Router();

CartRouter.post("/", insertCart);
CartRouter.get("/:id_pelanggan/:id_produk", getCartProductById);
CartRouter.put("/:id_keranjang", updateCart);
CartRouter.get("/", getCart);
// CartRouter.delete("/:idCustomer", deleteCart);

export default CartRouter;