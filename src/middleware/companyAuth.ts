import { Request, Response, NextFunction } from 'express';
import CustomErrorHandler from '../services/customErrorHandeler';
import JwtService from '../services/jwtServices';

const companyAuth = async (req: any, res: Response, next: NextFunction) => {
    let authHeader = req.headers.authorization;
    console.log(authHeader);
    if (!authHeader) {
        return next(CustomErrorHandler.unAuthorized());
    }

    const token = authHeader.split(' ')[1];
    try {
        const decode: any = JwtService.verify(token);

        if(decode.role==='company'){
            const company = {
                id: decode._id,
                role: decode.role,
            };
            req.user = company;
            next();
        }else{
            return next(CustomErrorHandler.unAuthorized());
        }
    } catch (error) {
        return next(CustomErrorHandler.unAuthorized());
    }
};

export default companyAuth;
