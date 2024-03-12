import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Application } from 'express';
import { config } from './config';
import errorHandler from './middleware/errorHandeler';
import databaseConnection from './utils/databaseConnection';
import logger from './utils/logger';

import adminRoutes from './routes/admin';
import companyRoutes from './routes/company';
import testRoutes from './routes/healthCheck';
import job from './routes/job';
import skillRoutes from './routes/skill';
import userRoutes from './routes/user';
import userAuthRoutes from './routes/userAuth';
import otpRoutes from './routes/otpVerification';
import chatRoutes from './routes/chart';
import forgetRoutes from './routes/forget';
import path from 'path';
export const app: Application = express();

app.use(
    '/public/upload',
    express.static(path.join(__dirname, '..', 'public', 'upload')),
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: [
            `${config.ORIGIN}`,
        ],
        credentials: true,
    }),
);

/* ----------------all routes---------------- */
app.use('/', testRoutes);
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/user', userRoutes);
app.use('/api/job', job);
app.use('/api/company', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/chart', chatRoutes);
app.use('/api/forget', forgetRoutes);

/* ----------------custom error handler---------------- */
app.use(errorHandler);

app.listen(config.PORT, async () => {
    logger.info(`RUNNING ON PORT NO ${config.PORT}`);
    await databaseConnection();
});
