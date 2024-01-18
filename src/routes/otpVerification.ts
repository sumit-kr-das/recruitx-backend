import express from 'express';
import otpVerification from '../controller/otpVerificationController';

const app = express();

// app.get('/verifyEmail', auth, otpVerification.verifyEmail);
app.post('/verifyOtp', otpVerification.verifyOtp);

export default app;
