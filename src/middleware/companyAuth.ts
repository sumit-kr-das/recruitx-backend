import {Request, Response, NextFunction} from 'express';
import User from "../model/User";
import CustomErrorHandler from '../services/customErrorHandeler';

const companyAuth = async (req:any, res:Response, next:NextFunction) => {
	try {
		const user:any = await User.findById(req.user.id);
		if (user.role === "company") {
			next();
		} else {
			return next(CustomErrorHandler.unAuthorized());
		}
	} catch (err:any) {
		return next(CustomErrorHandler.serverError());
	}
};

export default companyAuth;