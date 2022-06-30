import mongoose from "mongoose";

const Schema = mongoose.Schema;

const CategoryModel = new Schema({
    nama: {type: String}
})

export default mongoose.model("Categories", CategoryModel);