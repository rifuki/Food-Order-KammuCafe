import Products from "../models/ProductModel.js";
import path from "path";
import fs from "fs";

export const getProducts = async (req, res) => {
    try {
        const response = await Products.find();
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}

export const getProductById = async (req, res) => {
    try {
        const response = await Products.findOne({
            _id: req.params.id
        })
        res.status(200).json(response);
    }
    catch (error) {
        console.log(error.message);
    }
}

export const insertProduct = async (req, res) => {
    try {
        if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });

        const nama = req.body.nama;
        const harga = req.body.harga;
        const kategori = req.body.kategori;

        //gambarSize
        const gambar = req.files.gambar;
        const gambarSize = gambar.data.length;

        //gambarEkstension
        const extGambar = path.extname(gambar.name);

        //gambar New Name
        const gambarNewName = gambar.md5 + extGambar;

        //urlGambar
        // const urlGambar = `${req.protocol}://${req.get("host")}/images/${gambarNewName}`;

        //typeGambar
        const allowedGambarType = ['.png', '.jpg', '.jpeg'];

        //jikaBukanGambar
        if (!allowedGambarType.includes(extGambar.toLowerCase())) return res.status(422).json({ msg: "Invalid Image Type" });

        //jikaGambarLebihBesar
        if (gambarSize > 5000000) return res.status(422).json({ msg: "Image Must be Less Than 5 MB" });

        gambar.mv(`./public/images/${gambarNewName}`, async (err) => {
            if (err) return res.status(500).json({ msg: err.message })

            try {
                await Products.create({
                    nama: nama,
                    harga: harga,
                    kategori: kategori,
                    gambar: gambarNewName,
                })
                res.status(201).json({ msg: "Product Created Successfully" });
            }
            catch (err) {
                console.log(err.message);
            }
        })
    }
    catch (error) {
        console.log(error.message);
    }
}

export const updateProduct = async (req, res) => {
    const product = await Products.findOne({
        _id: req.params.id
    })
    if (!product) return res.status(404).json({ msg: "No Data Found!" });
    let gambarNewName = "";
    if (req.files === null) {
        gambarNewName = product.gambar;
    }
    else {
        const gambar = req.files.gambar;
        const gambarSize = gambar.data.length;
        const extGambar = path.extname(gambar.name);
        gambarNewName = gambar.md5 + extGambar;
        const allowedGambarType = ['.jpg', '.jpeg', '.png'];

        if (!allowedGambarType.includes(extGambar.toLowerCase())) return res.status(422).json({ msg: "Invalid Images!" });
        if (gambarSize > 5000000) return res.status(422).json({ msg: "Image Must be Less Than 5 MB" });

        const filePath = `./public/images/${product.gambar}`;
        fs.unlinkSync(filePath);

        gambar.mv(`./public/images/${gambarNewName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }

    const nama = req.body.nama;
    const harga = req.body.harga;
    const kategori = req.body.kategori;
    const url = `${req.protocol}://${req.get("host")}/images/${gambarNewName}`;
    try {
        await Products.updateOne({
            _id: req.params.id
        },
            {
                nama: nama,
                harga: harga,
                kategori: kategori,
                gambar: gambarNewName,
                url: url
            }, (err) => {
                if (err) return res.status(500).json({ msg: err.message });
                res.status(200).json({ msg: "Product Updated Sucessfully" });
            }
        ).clone();
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteProduct = async (req, res) => {
    const product = await Products.findOne({
        _id: req.params.id
    })
    if (!product) return res.status(404).json({ msg: "No Data Found" });
    try {
        const filePath = `./public/images/${product.gambar}`;
        fs.unlinkSync(filePath);
        await Products.deleteOne({
            _id: req.params.id
        });
        res.status(200).json({ msg: "Product Deleted Sucessfully!" });
    }
    catch (error) {
        console.log(error.message);
    }

}

export const getProductCategory = async (req, res) => {
    try {
        const response = await Products.find({
            kategori: req.query.nama
        })
        await res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}