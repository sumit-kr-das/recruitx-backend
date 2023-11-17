import User from '../../model/User';
import Joi from 'joi';
import userInfo from '../../model/userInfo';
import { Request, Response, NextFunction } from 'express';

const userRecomandation = {
    async userRecomand(req:Request, res:Response, next:NextFunction){
        const search = req.query.search;

        try {
            const users = await userInfo.find({skills: { $regex: search, $options: 'i' } });
            console.log(users);
        } catch (error) {
            next(error);
        }
    }
}

export default userRecomandation;