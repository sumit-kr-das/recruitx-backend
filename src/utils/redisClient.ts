import { createClient } from 'redis';
import { config } from '../config';
import logger from './logger';

const isProduction = Boolean(config.PRODUCTION);
const redis_base_url = config.REDIS_URL;

const getRedisURL = () => {
    if (isProduction && redis_base_url) {
        return redis_base_url;
    }
};

const redisClient = createClient({ url: getRedisURL() });

redisClient.on('connect', () => {
    logger.info('REDIS STORE CONNECTED');
});

redisClient.on('error', (err) => {
    logger.error(`REDIS ERROR: ${err}`);
});

export default redisClient;
