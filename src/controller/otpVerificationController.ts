import { Response, NextFunction } from 'express';
import nodemailer from 'nodemailer';
import logger from '../utils/logger';
import User from '../model/User';
import OtpVerification from '../model/otpVerification';

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
    /* GET http://localhost:8000/api/otp/verifyEmail */
    async verifyEmail({id, email}:{id: any, email: string}, res: Response, next: NextFunction) {
        try {
            // get users email
            // const userId = req?.user?.id;
            // const user = await User.findById(userId);
            // if (!user) {
            //     return res.status(401).json({ msg: 'user is not exist' });
            // }

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

            res.status(200).json({
                msg: `Verification otp sent on your email ${email}.`
            });
        } catch (err) {
            return logger.error(err);
        }
    },

    /* GET http://localhost:8000/api/otp/forgotPassword */
    async sentMail(req: any, res: Response, next: NextFunction) {
        console.log(req.otp);

        try {
            res.json({
                msg: 'mail sended successfully',
            });
        } catch (err) {
            return logger.error(err);
        }
    },
};

export default otpVerification;
