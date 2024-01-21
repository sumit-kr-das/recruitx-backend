import {Request, Response, NextFunction} from 'express';
import company from '../model/company';
import CustomErrorHandler from '../services/customErrorHandeler';

const companyAuth = async (req:any, res:Response, next:NextFunction) => {
	try {
		const user:any = await company.findById(req.user.id);
		if (user.role === 'company') {
			next();
		} else {
			return next(CustomErrorHandler.unAuthorized());
		}
	} catch (err:any) {
		return next(CustomErrorHandler.serverError());
	}
};

export default companyAuth;