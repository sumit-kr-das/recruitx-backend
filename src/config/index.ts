import dotenv from 'dotenv';

dotenv.config();

const port_no = process.env.PORT_NO || '';
const db_url = process.env.DB_URL || '';
const jwt_secret = process.env.JWT_SECRET || '';
const origin = process.env.ORIGIN || '';
const production = process.env.PRODUCTION || '';
const radis_url = process.env.REDIS_URL || '';

export const config = {
    PORT: port_no,
    DB_URL: db_url,
    JWT_SECRET: jwt_secret,
    ORIGIN: origin,
    PRODUCTION: production,
    REDIS_URL: radis_url,
};
