import express from 'express';
import otpVerification from '../controller/otpVerificationController';

const app = express();

app.post('/verifyOtp', otpVerification.verifyOtp);
app.post('/resendOtp', otpVerification.resendOtp);

export default app;
