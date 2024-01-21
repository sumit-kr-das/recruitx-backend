import express from 'express';
import registerController from '../controller/auth/RegisterController';
import loginController from '../controller/auth/LoginController';
import { MulterService } from '../services/multerService';

const router = express.Router();

router
    .post('/register', registerController.userRegister)
    .post('/login', loginController.userLogin);

export default router;
