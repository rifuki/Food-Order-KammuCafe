import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
    nama: { type: String, required: true },
    no_meja: { type: Number, requred: false }
}, { timestamps: true });

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
    jumlah: { type: Number },
    produk: ProductSchema,
    total_harga: { type: Number }
})

const OrderSchema = new Schema({
    // tanggal_transaksi: { type: Date },
    tanggal_bayar: { type: Date },
    total_bayar: { type: Number },
    pesanan: [CartModel],
    isBayar: { type: Boolean, default: false },
    isReady: { type: Boolean, default: false },
    estiminasi: { type: Number, default: 0 },
})

export default mongoose.model("Orders", OrderSchema);