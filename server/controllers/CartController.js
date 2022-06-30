import mongoose from "mongoose";
import Cart from "../models/CartModel.js";

export const insertCart = async (req, res) => {
    try {
        const { pelanggan, jumlah, produk, total_harga } = req.body;
        await Cart.create({
            pelanggan: pelanggan,
            jumlah: jumlah,
            produk: produk,
            total_harga: total_harga,
        })
        res.status(200).json({ msg: "Sukses Masuk Keranjang" });
    } catch (error) {
        console.log(error);
    }
}


export const getCartProductById = async (req, res) => {
    try {
        const { id_pelanggan, id_produk } = req.params;
        const id_pelanggan_bson = mongoose.Types.ObjectId(id_pelanggan);
        const id_produk_bson = mongoose.Types.ObjectId(id_produk);
        const response = await Cart.find({
            'pelanggan._id': id_pelanggan_bson,
            'produk._id': id_produk_bson
        })
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
}

export const updateCart = async (req, res) => {
    try {
        const { jumlah, produk, total_harga } = req.body;
        const { id_keranjang } = req.params;
        const id_keranjang_bson = mongoose.Types.ObjectId(id_keranjang)
        await Cart.updateOne({
            _id: id_keranjang_bson
        }, {
            jumlah: parseInt(jumlah),
            produk: produk,
            total_harga: parseInt(total_harga),
        },
            (err) => {
                if (err) res.status(500).json({ msg: err.message });
                res.status(200).json("Total Bayar Berubah")
            }).clone()
    }
    catch (error) {
        console.log(error.message);
    }
}

export const getCart = async (req, res) => {
    try {
        const { id_pelanggan } = req.query;
        const id_pelanggan_bson = mongoose.Types.ObjectId(id_pelanggan);
        const response = await Cart.find({
            'pelanggan._id': id_pelanggan_bson
        })
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
}

// export const deleteCart = async (req, res) => {
//     try{
//         const response = await Cart.deleteMany({
//             _id: req.params.namaCus
//         })
//         console.log(response);
//     }
//     catch(error){
//         console.log(error.message);
//     }
// }
