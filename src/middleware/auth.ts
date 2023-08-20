import { Request, Response, NextFunction } from 'express';
import CustomErrorHandler from '../services/customErrorHandeler';
import JwtService from '../services/jwtServices';

const auth = async (req: any, res: Response, next: NextFunction) => {
    let authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode: any = JwtService.verify(token);

        const user = {
            id: decode._id,
            role: decode.role,
        };
        
        req.user = user;
        next();
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }
};

export default auth;
