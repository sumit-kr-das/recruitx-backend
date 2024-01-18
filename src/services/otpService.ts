import { NextFunction, Response } from 'express';
import nodemailer from 'nodemailer';
import otpVerification from '../model/otpVerification';
import logger from '../utils/logger';
import { config } from '../config';

const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: Number(config.SMTP_PORT),
    secure: config.SMTP_SRC === 'flase',
    auth: {
        user: config.SMTP_MAIL,
        pass: config.SMTP_PASSWORD,
    },
});

const otpService = async (
    { id, email }: { id: any; email: string },
    res: Response,
    next: NextFunction,
) => {
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
        const newOTP = await new otpVerification({
            userId: id,
            otp: OTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTP.save();
    } catch (err) {
        return logger.error(err);
    }
};

export default otpService;
