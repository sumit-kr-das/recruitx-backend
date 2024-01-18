import { NextFunction, Response } from 'express';
import nodemailer from 'nodemailer';
import OtpVerification from '../model/otpVerification';
import logger from '../utils/logger';
import User from '../model/User';
import userStatus from '../services/userStatusService';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'info.sumit2001@gmail.com',
        pass: 'ecdv zjdp ekjn ldge',
    },
});

const otpVerification = {
    async verifyEmail(
        { id, email }: { id: any; email: string },
        res: Response,
        next: NextFunction,
    ) {
        try {
            // generate otp
            const OTP = Math.floor(100000 + Math.random() * 900000);

            // sent mail
            let sentEmail = {
                from: '"RecriitX" info.sumit2001@gmail.com',
                to: email,
                subject: 'Verify OTP - RecruitX',
                html: `<p>Enter <b>${OTP}</b> in the app to verify your email address. <br/><b>NOTE:</b> This code is expires in 1 hour.</p>`,
            };

            await transporter.sendMail(sentEmail, (err, info) => {
                if (err) {
                    return res.status(404).json({
                        msg: 'Server is busy right now please try after some time.',
                    });
                }
            });

            // save to the database
            const newOTP = await new OtpVerification({
                userId: id,
                otp: OTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000,
            });

            await newOTP.save();
        } catch (err) {
            return logger.error(err);
        }
    },

    /* GET http://localhost:8000/api/otp/verifyOtp */
    async verifyOtp(req: any, res: Response, next: NextFunction) {
        const { id, otp } = req.body;

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
};

export default otpVerification;
