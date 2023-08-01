import mongoose from 'mongoose';
import { config } from '../config';
import logger from './logger';

mongoose.connection.on('connected', () => {
    logger.info(`DB Connected [${config.DB_URL}]`);
});

mongoose.connection.on('disconnected', () => {
    logger.error('DB Disconnected ..x..x..x..');
});

const connect = async () => {
    try {
        await mongoose.connect(config.DB_URL);
    } catch (error) {
        logger.error(error);
    }
};

export default connect;
