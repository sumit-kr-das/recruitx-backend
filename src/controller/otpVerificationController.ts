import { NextFunction, Response } from 'express';
import User from '../model/User';
import OtpVerification from '../model/otpVerification';
import userStatus from '../services/userStatusService';
import logger from '../utils/logger';
import otpService from '../services/otpService';
import forgetPassword from '../services/forgetPasswordService';
import company from '../model/company';
import admin from '../model/admin';

const otpVerification = {
    /* POST http://localhost:8000/api/otp/verifyOtp */
    async verifyOtp(req: any, res: Response, next: NextFunction) {
        const { otp, userType } = req.body;
        const id = req.otpUserId;
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
            if (userType === "user") {
                await User.updateOne({ _id: id }, { status: userStatus.VERIFIED });
            } else if (userType === "company") {
                await company.updateOne({ _id: id }, { status: userStatus.VERIFIED });
            } else if (userType === "admin") {
                await admin.updateOne({ _id: id }, { status: userStatus.VERIFIED });
            }
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
        const id = req.otpUserId;
        const email = req.otpUserEmail;

        try {
            await OtpVerification.deleteMany({ userId: id });
            // await otpService({ id, email }, res, next);
            res.status(200).json({
                msg: 'Verification OTP sent on your email',
            });
        } catch (err) {
            return logger.error(err);
        }
    },
};

export default otpVerification;
