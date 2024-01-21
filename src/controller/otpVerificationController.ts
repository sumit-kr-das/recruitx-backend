import { NextFunction, Response } from 'express';
import User from '../model/User';
import OtpVerification from '../model/otpVerification';
import userStatus from '../services/userStatusService';
import logger from '../utils/logger';
import otpService from '../services/otpService';
import forgetPassword from '../services/forgetPasswordService';

const otpVerification = {
    /* POST http://localhost:8000/api/otp/verifyOtp */
    async verifyOtp(req: any, res: Response, next: NextFunction) {
        const { otp } = req.body;
        const id = req.otpUserId;
        console.log(id);
        try {
            const isExist = await OtpVerification.find({ userId: id });

            if (!isExist) {
                return res
                    .status(401)
                    .json({ msg: 'Please login or register the account' });
            }

            const expires = Number(isExist[0].expiresAt);

            if (expires < Date.now()) {
                await OtpVerification.deleteMany({ userId: id });
                return res
                    .status(401)
                    .json({ msg: 'Generated OTP is expired, resend now' });
            }

            if (isExist[0]?.otp !== otp) {
                return res
                    .status(401)
                    .json({ msg: 'Invalid OTP check your inbox' });
            }

            await User.updateOne({ _id: id }, { status: userStatus.VERIFIED });
            await OtpVerification.deleteMany({ userId: id });

            res.status(200).json({
                msg: 'Email verified successfuly',
            });
        } catch (err) {
            return logger.error(err);
        }
    },

    /* POST http://localhost:8000/api/otp/resendOtp */
    async resendOtp(req: any, res: Response, next: NextFunction) {
        const { email } = req.body;
        console.log(email);
        const id = req.otpUserId;
        console.log(id);

        try {
            if (!id || !email) {
                return res
                    .status(401)
                    .json({ msg: 'Enter valid user details' });
            }

            await OtpVerification.deleteMany({ userId: id });
            otpService({ id, email }, res, next);
            res.status(200).json({
                msg: 'Verification OTP sent on your email',
            });
        } catch (err) {
            return logger.error(err);
        }
    },
};

export default otpVerification;
