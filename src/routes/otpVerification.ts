import express from 'express';
import otpVerification from '../controller/otpVerificationController';
import otpUser from '../middleware/otpUser';

const app = express();

app.post('/verifyOtp', otpUser, otpVerification.verifyOtp);
app.post('/resendOtp', otpUser, otpVerification.resendOtp);

export default app;
