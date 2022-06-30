import "dotenv/config";
import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./configs/Database.js";
import CustomerController from "./routes/CustomerRouter.js";
import ProductRouter from "./routes/ProductRouter.js";
import CategoryRouter from "./routes/CategoryRouter.js";
import CartRouter from "./routes/CartRouter.js";
import OrderRouter from "./routes/OrderRoute.js";
import AdminRouter from "./routes/AdminRouter.js";

const app = express();
const PORT = process.env.PORT;
const origin = ["http://localhost", "http://192.168.122.1"];

// Database Connection
db.once("open", () => console.log("Database Successfully Connect"));

// Middleware
app.use(cors({ credentials: true, origin: origin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(FileUpload());
app.use(cookieParser());

//Router
app.use("/admin", AdminRouter);
app.use("/customer", CustomerController)
app.use("/categories", CategoryRouter);
app.use("/products", ProductRouter);
app.use("/cart", CartRouter);
app.use("/orders", OrderRouter);

//Port
app.listen(PORT, () => console.log(`Server is Beating on PORT ${PORT}`));
