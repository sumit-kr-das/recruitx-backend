import express, { Application, Request, Response } from 'express';
import connect from './src/utils/connection';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorHandler from './src/middleware/errorHandeler';
import { config } from './src/config';
import logger from './src/utils/logger';

import testRoutes from './src/routes/healthCheck';
import userAuthRoutes from './src/routes/userAuth';
import skillRoutes from './src/routes/skill';
import userRoutes from './src/routes/user';

const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

/* all routes */
app.use('/', testRoutes);
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/skill', skillRoutes);
app.use('/api/user', userRoutes);

/* custom error handler */
app.use(errorHandler);
app.use(express.static(__dirname));

app.listen(config.PORT, async () => {
    logger.info(`Running on port no ${config.PORT}`);
    await connect();
});
