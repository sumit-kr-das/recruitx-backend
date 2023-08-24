import { Request, Response, NextFunction } from 'express';
import CustomErrorHandler from '../services/customErrorHandeler';
import jwt from "jsonwebtoken";
import { config } from '../config';
import JwtService from '../services/jwtServices';

const auth = async (req:any, res:Response, next:NextFunction) => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return next(CustomErrorHandler.unAuthorized());

	}

	const token = authHeader.split(" ")[1];

	try {
		jwt.verify(token, config.JWT_SECRET, (err:any, user:any) => {
			if (err) {
				return next(CustomErrorHandler.unAuthorized());

			}
			req.user = user;
			next();
		});
	} catch (err:any) {
		return next(CustomErrorHandler.serverError());

	}
};

export default auth;
