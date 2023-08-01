import express from 'express';
import registerController from '../controller/auth/RegisterController';
import loginController from '../controller/auth/LoginController';

const router = express.Router();

router
    .post('/register', registerController.companyRegister)

export default router;