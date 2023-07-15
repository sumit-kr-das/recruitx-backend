import mongoose from "mongoose"
import { config } from "../config";

const connect= async() =>{
    console.log(config.DB_URL);
    try {
        await mongoose.connect(config.DB_URL);
        console.log("DB connected");
    } catch (error) {
        console.log(error);
    }
}

export default connect;