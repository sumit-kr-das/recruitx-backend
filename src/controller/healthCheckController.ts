import { Request, Response } from 'express';

const healthCheckController = {
    healthCheck(req: Request, res: Response) {
        const checkHealth = {
            uptime: process.uptime(),
            responsetime: process.hrtime(),
            message: 'OK yaa',
            timestamp: Date.now(),
        };
        try {
            res.send(checkHealth);
        } catch (err: any) {
            checkHealth.message = err;
            res.status(503).send();
        }
    },
};

export default healthCheckController;
