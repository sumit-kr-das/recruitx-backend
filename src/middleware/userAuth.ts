import {Request, Response, NextFunction} from 'express';
import User from "../model/User";
import CustomErrorHandler from '../services/customErrorHandeler';

const userAuth = async (req:any, res:Response, next:NextFunction) => {
	try {
		const user:any = await User.findById(req.user.id);
		if (user.role === "user") {
			next();
		} else {
			return next(CustomErrorHandler.unAuthorized());

		}
	} catch (err:any) {
		return next(CustomErrorHandler.unAuthorized());

	}
};

export default userAuth;