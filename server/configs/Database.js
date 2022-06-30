import mongoose from "mongoose";

const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DBNAME;

mongoose.connect(url + dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

export default db;