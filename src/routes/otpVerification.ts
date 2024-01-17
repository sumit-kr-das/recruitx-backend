import express from 'express';
import otpVerification from '../controller/otpVerificationController';
import userAuth from '../middleware/userAuth';
import auth from '../middleware/auth';

const app = express();

// app.get('/verifyEmail', auth, otpVerification.verifyEmail);

export default app;
