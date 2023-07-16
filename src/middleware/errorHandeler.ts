import { Request, Response, NextFunction } from "express"
import { config } from "../config";
import { ValidationError } from "joi";
import CustomErrorHandler from "../services/customErrorHandeler";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let errData = {
        message: "Internal Server Error",
        // ...(config.DEBUG_MODE === 'true' && { originError: err.message })
    }

    if(err instanceof ValidationError) {
        statusCode = 422;
        errData = {
            message: err.message
        }
    }

    if(err instanceof CustomErrorHandler) {
        statusCode = err.status;
        errData = {
            message: err.message
        }
    }

    return res.status(statusCode).json(errData);
}

export default errorHandler