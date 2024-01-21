import User from '../../model/User';
import Joi from 'joi';
import userInfo from '../../model/userInfo';
import { Request, Response, NextFunction } from 'express';

const userRecomandation = {
    async userRecomand(req: Request, res: Response, next: NextFunction) {
        const search = req.query.search;
        try {
            const users = await userInfo.find({ skills: { $regex: search, $options: 'i' } }).populate('userId', 'username email workStatus').select('-__v -createdAt -updatedAt');
            return res.status(200).json(users)
        } catch (error) {
            return next(error);
        }
    }
}

export default userRecomandation;