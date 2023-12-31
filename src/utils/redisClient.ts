import { createClient } from 'redis';
import { config } from '../config';
import logger from './logger';

const PRODUCTION = config.PRODUCTION;
const PORT = Number(config.REDIS_PORT);

const redisClient = createClient({
    legacyMode: true,
    socket: {
        host: PRODUCTION === 'true' ? config.REDIS_HOST : 'localhost',
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
