import express from 'express';
import chartController from '../controller/chart/ChartController';
import auth from '../middleware/auth';

const router = express.Router();

router.get("/job/:role", [auth], chartController.getJobChart);

export default router;