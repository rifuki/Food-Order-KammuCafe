import express from "express";
import { RegisterCustomer } from "../controllers/CustomerController.js";

const CustomerController = express.Router();

// CustomerController.get("/:id", getCustomerById);
CustomerController.post("/", RegisterCustomer);

export default CustomerController;