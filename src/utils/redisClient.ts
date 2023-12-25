import { createClient } from 'redis';
import logger from './logger';

const redisClient = createClient();

redisClient.on('connect', () => {
    logger.info('REDIS STORE CONNECTED');
});

redisClient.on('error', (err) => {
    logger.error(`REDIS ERROR: ${err}`);
});

export default redisClient