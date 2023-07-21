import dotenv from "dotenv";

dotenv.config();

const db_url = process.env.DB_URL || "";
const jwt_secret = process.env.JWT_SECRET || "";

export const config = {
    DB_URL : db_url,
    JWT_SECRET : jwt_secret
}