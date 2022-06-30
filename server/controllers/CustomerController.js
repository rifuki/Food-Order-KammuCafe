import mongoose from "mongoose";
import Customer from "../models/CustomerModel.js";

export const RegisterCustomer = async (req, res) => {
    try {
        const { nama, no_meja } = req.body;
        const response = await Customer.create({
            _id: new mongoose.Types.ObjectId(),
            nama: nama,
            no_meja: no_meja
        })
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
}

// export const getCustomerById = async (req, res) => {
//     try {
//         const id = mongoose.Types.ObjectId(req.params.id);
//     }
//     catch(error){
//         console.log(error);
//     }
// }