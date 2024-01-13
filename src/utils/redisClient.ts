import { Redis } from 'ioredis';
import { config } from '../config';

const getRedisUrl = () => {
    if (config.REDIS_URL) {
        return {
          port: 6379, // Redis port
          host: "127.0.0.1", // Redis host
        }
    }

    throw new Error('REDIS_URL not defined');
};

export const redisClient = new Redis(getRedisUrl());

export default redisClient;
