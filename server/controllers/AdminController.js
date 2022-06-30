import Admins from "../models/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// export const getAdmins = async (req, res) => {
//     const response = await Admins.find().select({"username":1, "password":1});
//     const authHeader = req.headers['authorization'];
//     res.status(200).json(response);
// }

export const Register = async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    if (password !== confirmPassword) res.status(400).json({ msg: "Password Tidak Cocok" });

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        await Admins.create({
            username: username,
            password: hashPassword
        });
        res.status(200).json({ msg: "Register User Admin Berhasil" });
    }
    catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const Login = async (req, res) => {
    try {
        const user = await Admins.find({
            username: req.body.username
        });

        if (user.length === 0) return res.status(404).json({ msg: "User Admin Tidak Ditemukan" });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(404).json({ msg: "Password Tidak Cocok" });

        const userId = user[0]._id;
        const username = user[0].username;
        const accessToken = jwt.sign({ userId, username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({ userId, username }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })

        await Admins.updateOne({
            _id: userId
        }, {
            refresh_token: refreshToken
        }, (err) => {
            if (err) return res.status(400).json({ msg: err.message });
            const coookie = res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            });
            res.json({ accessToken });
        }).clone();
    }

    catch (error) {
        console.log(error.message);
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const user = await Admins.find({
        refresh_token: refreshToken
    })
    if (!user[0]) return res.sendStatus(403);
    const userId = user[0]._id;
    await Admins.updateOne({
        _id: userId
    }, {
        refresh_token: null
    }, (err) => {
        if (err) return res.sendStatus(400);
        res.clearCookie('refreshToken');
        return res.sendStatus(200);
    }).clone();
}