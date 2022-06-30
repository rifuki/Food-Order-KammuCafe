import mongoose from "mongoose";
import Order from "../models/OrderModel.js";
import Cart from "../models/CartModel.js";
import easyinvoice from "easyinvoice";
import path from "path";
import fs from "fs";

export const insertOrder = async (req, res) => {
    try {
        const { total_bayar, pesanan } = req.body;
        const id_pelanggan = mongoose.Types.ObjectId(pesanan[0].pelanggan._id);
        //masukkan keranjang ke transaksi
        await Order.create({
            // tanggal_transaksi: Date(),
            total_bayar: total_bayar,
            pesanan: pesanan
        })
        //hapus keranjang berdasarkan id pelanggan
        await Cart.deleteMany({
            'pelanggan._id': id_pelanggan
        })
        res.status(200).json({ msg: "Silahkan Melakukan Pembayaran di Kasir" });
    } catch (error) {
        console.log(error);
    }
}

export const getOrders = async (req, res) => {
    try {
        const response = await Order.find();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

export const getOrdersByIdCustomer = async (req, res) => {
    const { id_pelanggan } = req.params;
    const id_pelanggan_bson = mongoose.Types.ObjectId(id_pelanggan);
    try {
        const response = await Order.find({
            'pesanan.pelanggan._id': id_pelanggan_bson
        });
        return res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const { id_transaksi } = req.params;
        const id_transaksi_bson = mongoose.Types.ObjectId(id_transaksi);
        await Order.findOneAndDelete({
            _id: id_transaksi_bson
        })
    } catch (error) {
        console.log(error);
    }
}

export const confirmTransaction = async (req, res) => {
    try {
        const { id_transaksi } = req.params;
        const id_transaksi_bson = mongoose.Types.ObjectId(id_transaksi);
        await Order.updateOne({
            _id: id_transaksi_bson
        }, {
            tanggal_bayar: new Date(),
            isBayar: req.body.isBayar

        }, (err) => {
            if (err) return json.status(400).json({ msg: err });
            res.status(200).json({ msg: "Berhasil diBayar" });
        }).clone();
    } catch (error) {
        console.log(error);
    }
}

export const confirmOrder = async (req, res) => {
    try {
        const { id_transaksi } = req.params;
        const id_transaksi_bson = mongoose.Types.ObjectId(id_transaksi);    
        await Order.updateOne({
            _id: id_transaksi_bson
        }, {
            estiminasi: req.body.estiminasi,
            isReady: req.body.isReady,
        }, (err) => {
            if (err) return json.status(400).json({ msg: err });
            res.status(200).json({ msg: "Berhasil diBayar" });
        }).clone();
    } catch (error) {
        console.log(error);
    }
}


export const getInvoice = async (req, res) => {
    try {
        const { data_transaksi } = req.body;
        const tanggal_bayar = new Date(data_transaksi.tanggal_bayar).toISOString();
        const pesanan = data_transaksi.pesanan;
        const pelanggan = pesanan[0].pelanggan;

        /* ------------------------------------------  */
        const imgPath = path.resolve("public/images", "logo.png");
        function base64_encode(imgPath) {
            let png = fs.readFileSync(imgPath);
            return new Buffer.from(png).toString("base64");
        };

        const data = {
            "images": {
                "logo": base64_encode(imgPath),
            },
            "sender": {
                "company": "Kammu Cafe",
                "address": "Jalan Raya Cikande Rangkasbitung, Mekarsari, Jawilan",
                "zip": "42180",
                "city": "Serang",
                "country": "Banten"
            },
            "client": {
                "company": `Customer Name : ${pelanggan.nama}`,
                "address": `Table Number : ${pelanggan.no_meja}`,
                // "zip": `Customer Name : ${pelanggan.nama}`,
                // "city": "",
                // "country": "",
                // "meja": pelanggan.no_meja
            },
            "information": {
                // Invoice number
                "number": data_transaksi._id,
                // Invoice data
                "date": new Date(data_transaksi.tanggal_transaksi).toLocaleString(),
                // // Invoice due date
                "due-date": new Date(tanggal_bayar).toLocaleString()
            },
            "products":
                pesanan.map((data) => {
                    return {
                        "description": data.produk.nama,
                        "quantity": data.jumlah,
                        "tax-rate": 0,
                        "price": data.total_harga
                    }
                })

            ,
            "bottom-notice": "Thank you for shopping at KammuCafe",
            "settings": {
                "currency": "IDR"
            },
        };
        /* ------------------------------------------  */
        
        easyinvoice.createInvoice(data, async (result) => {
            let namaFile = `${pelanggan.nama}-${tanggal_bayar}.pdf`;
            let filePath = `${req.protocol}://${req.get("host")}/pdf/${namaFile}`;
            await fs.writeFileSync(`./public/pdf/${namaFile}`, result.pdf, 'base64');
            res.status(200).json(filePath);
        });
    } catch (error) {
        console.log(error);
    }
}