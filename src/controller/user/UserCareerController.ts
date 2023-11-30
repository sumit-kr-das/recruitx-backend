import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import userCareerProfile from '../../model/userCareerProfile';
import CustomErrorHandler from '../../services/customErrorHandeler';


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

        const { industry, role, jobRole, jobType, employmentType, skills, expectedSalary }: { industry: string, role: string, jobRole: string, jobType: string, employmentType: string, skills: [string], expectedSalary: number } = req.body;

        const userCarrer = new userCareerProfile({
            userId: req.user.id,
            industry,
            role,
            jobRole,
            jobType,
            employmentType,
            skills,
            expectedSalary
        });

        try {
            const addCarrer = await userCarrer.save();
            if (addCarrer) {
                return res.status(200).json({ msg: "Carrer Profile updated successfully" });
            }
        } catch (error) {
            return next(error);
        }
    },


    async viewUserCarrer(req: any, res: Response, next: NextFunction) {
        try {
            const userCarrer = await userCareerProfile.findOne({ userId: req.user.id }).select('-__v -userId');
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

        const { industry, role, jobRole, jobType, employmentType, skills, expectedSalary }: {
            industry: string,
            role: string,
            jobRole: string,
            jobType: string,
            employmentType: string,
            skills: string[],
            expectedSalary: number
        } = req.body;

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