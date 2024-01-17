import { Request, Response, NextFunction } from 'express';
import admin from '../model/admin';
import CustomErrorHandler from '../services/customErrorHandeler';

const adminAuth = async (req: any, res: Response, next: NextFunction) => {
	try {
		const user: any = await admin.findById(req.user.id);
		if (user.role === "admin") {
			next();
		} else {
			return next(CustomErrorHandler.unAuthorized());
		}
	} catch (err: any) {
		return next(CustomErrorHandler.serverError());
	}
};

export default adminAuth;