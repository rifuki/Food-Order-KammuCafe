import Admins from "../models/AdminModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);

        const user = await Admins.find({
            refresh_token: refreshToken
        })
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
            if(err) res.sendStatus(403);
            const userId = user[0]._id;
            const username = user[0].username;
            const accessToken = jwt.sign({userId, username}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '120s'
            });
            res.json({accessToken});
        });
    } catch (error) {
        console.log(error.message);
    }
}