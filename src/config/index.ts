import dotenv from 'dotenv';

dotenv.config();

const port_no = process.env.PORT_NO || '';
const app_url = process.env.APP_URL || '';
const db_url = process.env.DB_URL || '';
const jwt_secret = process.env.JWT_SECRET || '';
const origin = process.env.ORIGIN || '';
const production = process.env.PRODUCTION || '';

const radis_port = process.env.REDIS_PORT || '';
const radis_host = process.env.REDIS_HOST || '';
const radis_password = process.env.REDIS_PASSWORD || '';

const smtp_host = process.env.SMTP_HOST || '';
const smtp_port = process.env.SMTP_PORT || '';
const smtp_src = process.env.SMTP_SRC || '';
const smtp_mail = process.env.SMTP_MAIL || '';
const smtp_password = process.env.SMTP_PASSWORD || '';

const cloudnary_cloud_name = process.env.CLOUDNARY_CLOUD_NAME || '';
const cloudnary_api_key = process.env.CLOUDNARY_API_KEY || '';
const cloudnary_api_secret = process.env.CLOUDNARY_API_SECRET || '';

export const config = {
    PORT: port_no,
    APP_URL: app_url,
    DB_URL: db_url,
    JWT_SECRET: jwt_secret,
    ORIGIN: origin,
    PRODUCTION: production,
    REDIS_PORT: radis_port,
    REDIS_HOST: radis_host,
    REDIS_PASSWORD: radis_password,
    SMTP_HOST: smtp_host,
    SMTP_SRC: smtp_src,
    SMTP_PORT: smtp_port,
    SMTP_MAIL: smtp_mail,
    SMTP_PASSWORD: smtp_password,
    CLOUDNARY_CLOUD_NAME: cloudnary_cloud_name,
    CLOUDNARY_API_KEY: cloudnary_api_key,
    CLOUDNARY_API_SECRET: cloudnary_api_secret,
};
