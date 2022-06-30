import express from "express";
import {confirmOrder, deleteOrder, getOrdersByIdCustomer, getOrders, insertOrder, getInvoice, confirmTransaction } from "../controllers/OrderController.js";

const OrderRouter = express.Router();

OrderRouter.get("/:id_pelanggan", getOrdersByIdCustomer);
OrderRouter.get("/", getOrders)
OrderRouter.post("/", insertOrder);
OrderRouter.post("/faktur", getInvoice);
OrderRouter.put("/:id_transaksi", confirmTransaction);
OrderRouter.put("/order/:id_transaksi", confirmOrder);
OrderRouter.delete("/:id_transaksi", deleteOrder);

export default OrderRouter;