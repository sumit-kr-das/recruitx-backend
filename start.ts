import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { config } from './src/config';
import errorHandler from './src/middleware/errorHandeler';
import databaseConnection from './src/utils/databaseConnection';
import redisClient from './src/utils/redisClient';
import logger from './src/utils/logger';

import adminRoutes from './src/routes/admin';
import companyRoutes from './src/routes/company';
import testRoutes from './src/routes/healthCheck';
import job from './src/routes/job';
import skillRoutes from './src/routes/skill';
import userRoutes from './src/routes/user';
import userAuthRoutes from './src/routes/userAuth';

const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: `${config.ORIGIN}`, credentials: true }));

/* ----------------all routes---------------- */
app.use('/', testRoutes);
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/user', userRoutes);
app.use('/api/job', job);
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);

/* ----------------custom error handler---------------- */
app.use(errorHandler);
app.use(express.static(__dirname));

app.listen(config.PORT, async () => {
    logger.info(`RUNNING ON PORT NO ${config.PORT}`);
    await databaseConnection();
    redisClient.connect();
});
