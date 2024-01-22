import { Request, Response, NextFunction } from 'express';
import Joi, { cache } from 'joi';
import userCareerProfile from '../../model/userCareerProfile';
import CustomErrorHandler from '../../services/customErrorHandeler';
import { IUserCareerReqBody } from '../../@types/userCareerTypes';
import redisClient from '../../utils/redisClient';


const userCarrerController = {
    async addUserCarrer(req: any, res: Response, next: NextFunction) {
        const userCarrerSchema = Joi.object({
            industry: Joi.string().required(),
            role: Joi.string().required(),
            jobRole: Joi.string().required(),
            jobType: Joi.string().required(),
            employmentType: Joi.string().required(),
            skills: Joi.array().required(),
            expectedSalary: Joi.number().required()
        });

        const { error } = userCarrerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { industry, role, jobRole, jobType, employmentType, skills, expectedSalary }: IUserCareerReqBody = req.body;
        const userId = req.user.id;
        const userCarrer = new userCareerProfile({
            userId,
            industry,
            role,
            jobRole,
            jobType,
            employmentType,
            skills,
            expectedSalary
        });

        try {
            const carrerCacheKey = `userCarrer:${req.user.id}`;
            const allUserInfoCacheKey = `allUserInfo:${userId}`;
            await redisClient.del(carrerCacheKey);
            await redisClient.del(allUserInfoCacheKey);
            const addCarrer = await userCarrer.save();
            if (addCarrer) {
                return res.status(200).json({ msg: "Carrer Profile updated successfully" });
            }
        } catch (error) {
            return next(error);
        }
    },


    async viewUserCarrer(req: any, res: Response, next: NextFunction) {
        const cacheKey = `userCarrer:${req.user.id}`;
        try {
            const carrerCache = await redisClient.get(cacheKey);
            if (carrerCache) {
                return res.status(200).json(JSON.parse(carrerCache));
            }
            const userCarrer = await userCareerProfile.findOne({ userId: req.user.id }).select('-__v -userId');
            await redisClient.set(cacheKey, JSON.stringify(carrerCache));
            return res.status(200).json(userCarrer);
        } catch (error) {
            return next(error);
        }
    },

    async editUserCarrer(req: any, res: Response, next: NextFunction) {
        const userCareerSchema = Joi.object({
            industry: Joi.string().required(),
            role: Joi.string().required(),
            jobRole: Joi.string().required(),
            jobType: Joi.string().required(),
            employmentType: Joi.string().required(),
            skills: Joi.array().required(),
            expectedSalary: Joi.number().required(),
        });

        const { error } = userCareerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { industry, role, jobRole, jobType, employmentType, skills, expectedSalary }: IUserCareerReqBody = req.body;

        try {
            const userCareer = await userCareerProfile.findOneAndUpdate(
                { _id: req.params.id },
                {
                    industry,
                    role,
                    jobRole,
                    jobType,
                    employmentType,
                    skills,
                    expectedSalary
                },
                { new: true }
            );

            if (userCareer) {
                const carrerCacheKey = `userCarrer:${req.user.id}`;
                const allUserInfoCacheKey = `allUserInfo:${req.user.id}`;
                await redisClient.del(carrerCacheKey);
                await redisClient.del(allUserInfoCacheKey);
                return res.status(200).json({ msg: "Career Profile updated successfully" });
            } else {
                next(CustomErrorHandler.serverError());
            }
        } catch (error) {
            return next(error);
        }
    },

    async deleteUserCarrer(req: any, res: Response, next: NextFunction) {
        try {
            const deletedCareer = await userCareerProfile.findOneAndDelete({
                _id: req.params.id
            });

            if (deletedCareer) {
                const carrerCacheKey = `userCarrer:${req.user.id}`;
                const allUserInfoCacheKey = `allUserInfo:${req.user.id}`;
                await redisClient.del(carrerCacheKey);
                await redisClient.del(allUserInfoCacheKey);
                res.status(200).json({ msg: "Career Profile deleted successfully" });
            } else {
                res.status(404).json({ msg: "Career Profile not found" });
            }
        } catch (error) {
            return next(error);
        }
    }

}


export default userCarrerController;