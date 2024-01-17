import express, { Request, Response } from 'express';
import healthCheckController from '../controller/healthCheckController';

const router = express.Router();

router
    .get('/', (req: Request, res: Response) => {
        res.json({
            title: 'RecruitX API',
            msg: 'A job searching api',
            lisence: 'MIT',
            gitHub: 'https://github.com/sumit-kr-das/recruitx-backend',
            releases: 'v1',
        });
    })
    .get('/healthcheck', healthCheckController.healthCheck);

export default router;
