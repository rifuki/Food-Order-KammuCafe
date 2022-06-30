import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    nama: { type: String, required: true },
    no_meja: {type: Number, requred: false}
}, {timestamps: true});

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

const CartModel = new Schema({
    pelanggan: CustomerSchema,
    jumlah: {type: Number},
    produk: ProductSchema,
    total_harga: {type: Number}
})

export default mongoose.model("Cart", CartModel);