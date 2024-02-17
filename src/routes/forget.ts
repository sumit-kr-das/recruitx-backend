import express from 'express';
import forgetPasswordController from '../controller/forgetPasswordController';

const router = express.Router();

router.post("/password/otpsend", forgetPasswordController.forgetPassword)
    .put("/password/change", forgetPasswordController.changeForgotPassword);
export default router;