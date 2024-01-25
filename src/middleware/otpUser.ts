import { Request, Response, NextFunction } from 'express';
import CustomErrorHandler from '../services/customErrorHandeler';
import jwt from "jsonwebtoken";
import { config } from '../config';
import JwtService from '../services/jwtServices';
import forgetPassword from '../services/forgetPasswordService';
import User from '../model/User';
import company from '../model/company';
import admin from '../model/admin';

const otpUser = async (req: any, res: Response, next: NextFunction) => {
    const { email, userType } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        const id = await forgetPassword({ email, userType }, res, next);
        req.otpUserId = id?._id;
        req.otpUserEmail = email;
        return next();
    }

    const token = authHeader.split(" ")[1];
    try {
        console.log("hi");
        jwt.verify(token, config.JWT_SECRET, async (err: any, user: any) => {
            if (err) {
                return next(CustomErrorHandler.unAuthorized());
            }
            let data;
            if (userType === "user") {
                data = await User.findById(user.id);
            } else if (userType === "company") {
                data = await company.findById(user.id);
            } else if (userType === "admin") {
                data = await admin.findById(user.id)
            }
            req.otpUserId = user.id;
            req.otpUserEmail = data?.email;
            next();
        });
    } catch (err: any) {
        return next(CustomErrorHandler.serverError());

    }
};

export default otpUser;
