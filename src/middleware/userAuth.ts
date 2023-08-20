import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import CustomErrorHandler from "../services/customErrorHandeler";
import roles from "../services/roleService";

export function verifyToken(req:any, res:Response, next:NextFunction) {
	const authHeader = req?.headers?.authorization;

    const JWT_SECRET = config.JWT_SECRET;

	if (!req.headers || !authHeader|| !authHeader.startsWith("Bearer ")) {
		return next(CustomErrorHandler.unAuthorized());
	}

	const token = authHeader.split(" ")[1];
	
	try{
		jwt.verify(token, JWT_SECRET, (err:any, user:any) => {
			if (err) {
				return next(CustomErrorHandler.unAuthorized());
			}
			req.user = user;
			next();
		});
	}catch(err){
		return next(CustomErrorHandler.unAuthorized());
	}
}

export function verifyUser(req:any, res:Response, next:NextFunction) {
	verifyToken(req, res, () => {
		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			next(CustomErrorHandler.unAuthorized());
		}
	});
}

export function verifyCompany(req:any, res:Response, next:NextFunction) {
	verifyToken(req, res, () => {
		if (req.user.id===req.params.id || req.user.) {
			next();
		} else {
			next(CustomErrorHandler.unAuthorized());
		}
	});
}

export function verifyAdmin(req:any, res:Response, next:NextFunction) {
	verifyToken(req, res, () => {
		if (req.user.isAdmin) {
			next();
		} else {
			next(CustomErrorHandler.unAuthorized());
		}
	});
}