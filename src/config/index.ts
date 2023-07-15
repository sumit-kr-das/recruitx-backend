import dotenv from "dotenv";

dotenv.config();

const db_url = process.env.DB_URL || "";

export const config = {
    DB_URL : db_url
}