import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import User from "../../model/User";
import CustomErrorHandler from '../../services/customErrorHandeler';
import bcrypt from 'bcrypt';
import JwtService from '../../services/jwtServices';

const UserController = {
    async viewUser(req:any, res:Response, next:NextFunction){
        try {
            const user = await User.findOne({_id: req.user.id}).select('-password -updatedAt -__v');
            if(!user){
                return next(CustomErrorHandler.notFound());
            }
            res.json(user);
        } catch (error) {
            return next(error);
        }
    }
}

export default UserController;