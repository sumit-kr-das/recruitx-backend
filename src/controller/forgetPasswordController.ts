import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import User from "../model/User";
import company from "../model/company";
import admin from "../model/admin";
import otpService from "../services/otpService";
import bcrypt from 'bcrypt';


const forgetPasswordController = {
    async forgetPassword(req: Request, res: Response, next: NextFunction) {
        const forgetPasswordSchema = Joi.object({
            email: Joi.string().required(),
            role: Joi.string().required()
        });

        const { error } = forgetPasswordSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { email, role }: { email: string, role: string } = req.body;

        try {
            let data;
            switch (role) {
                case '1':
                    data = await User.findOne({ email });
                    break;
                case '2':
                    data = await company.findOne({ email });
                    break;
                case '3':
                    data = await admin.findOne({ email });
                    break;
                default:
                    return res.status(422).json({ message: "Role is invalid" })
            }
            if (!data) {
                return res.status(422).json({ msg: "User not found" });
            }
            otpService({ id: data?._id, email: data?.email }, res, next);
            return res.status(200).json({ message: "OTP send to your email" });
        } catch (error) {
            next(error);
        }
    },

    async changeForgotPassword(req: Request, res: Response, next: NextFunction) {
        const changePasswordSchema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().required()
        });

        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            next(error)
        }

        const { password, email, role } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            switch (role) {
                case "1":
                    await User.findOneAndUpdate({ email }, { password: hashedPassword }, { returnOriginal: false });
                    break;
                case "2":
                    await company.findOneAndUpdate({ email }, { password: hashedPassword }, { returnOriginal: false });
                    break;
                case "3":
                    await admin.findOneAndUpdate({ email }, { password: hashedPassword }, { returnOriginal: true });
                    break;
                default:
                    break;
            }
            return res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            next(error);
        }
    }
}

export default forgetPasswordController;