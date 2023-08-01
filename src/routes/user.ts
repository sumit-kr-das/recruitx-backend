import express from 'express';
import UserController from '../controller/user/UserController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/view', auth, UserController.viewUser);

export default router;
