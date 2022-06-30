import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    nama: {
        type: String,
        required: true
    },
    harga: {
        type: Number,
        required: true
    },
    kategori: {
        type: String,
        required: true
    },
    gambar: {
        type: String,
        required: false
    }
})


export default mongoose.model("Products", ProductSchema);