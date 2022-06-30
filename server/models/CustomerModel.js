import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    nama: { type: String, required: true },
    no_meja: {type: Number, requred: false}
}, {timestamps: true});

export default mongoose.model("Customers", CustomerSchema);