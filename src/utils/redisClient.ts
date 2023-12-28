import { createClient } from 'redis';
import { config } from '../config';
import logger from './logger';

const PORT = Number(config.REDIS_PORT);
const HOST = config.REDIS_HOST;

const redisClient = createClient({
    legacyMode: true,
    socket: {
        host: HOST,
        port: PORT,
    },
});

redisClient.on('connect', () => {
    logger.info('REDIS STORE CONNECTED');
});

redisClient.on('error', (err) => {
    logger.error(`REDIS ERROR: ${err}`);
});

export default redisClient;
