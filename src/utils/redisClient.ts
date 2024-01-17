import { Redis } from 'ioredis';
import { config } from '../config';

const getRedisUrl = () => {
    if (config.REDIS_PORT) {
        return {
            port: Number(config.REDIS_PORT),
            host: config.REDIS_HOST,
            password: config.REDIS_PASSWORD,
        };
    }

    throw new Error('REDIS_URL not defined');
};

export const redisClient = new Redis(getRedisUrl());

export default redisClient;
