import mongoose from 'mongoose';
import { config } from '../config';
import logger from './logger';

mongoose.connection.on('connected', () => {
    logger.info(`DATABASE CONNECTED`);
});

mongoose.connection.on('disconnected', () => {
    logger.error('DATABASE CONNECTION ERROR ..x..x..x..');
});

const databaseConnection = async () => {
    try {
        await mongoose.connect(config.DB_URL);
    } catch (error) {
        logger.error(error);
    }
};

export default databaseConnection;
