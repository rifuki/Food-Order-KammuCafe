import CategoryModel from "../models/CategoryModel.js";


export const getCategories = async (req, res) => {
    try {
        const categories = await CategoryModel.find();
        res.status(200).json(categories);
    }
    catch (error) {
        console.log(error.message);
    }
}

// export const getCategory = async (req, res) => {
//     try {
//         const category = await CategoryModel.findOne({
//             nama: req.body.nama
//         })
//         res.status(200).json(category);
//     }
//     catch (error) {
//         console.log(error.message);
//     }
// }