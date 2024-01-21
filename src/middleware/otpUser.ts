import { Request, Response, NextFunction } from 'express';
import CustomErrorHandler from '../services/customErrorHandeler';
import jwt from "jsonwebtoken";
import { config } from '../config';
import JwtService from '../services/jwtServices';
import forgetPassword from '../services/forgetPasswordService';

const otpUser = async (req: any, res: Response, next: NextFunction) => {
    const { email, userType } = req.body;
    const authHeader = req.headers.authorization;
    // if (!authHeader && !email && !userType) {
    //     return next();
    // }

    if (!authHeader) {
        const id = await forgetPassword({ email, userType }, res, next);
        console.log(id?._id, "user id");
        req.otpUserId = id?._id;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        jwt.verify(token, config.JWT_SECRET, (err: any, user: any) => {
            if (err) {
                return next(CustomErrorHandler.unAuthorized());
            }
            req.otpUserId = user._id;
            next();
        });
    } catch (err: any) {
        return next(CustomErrorHandler.serverError());

    }
};

export default otpUser;
