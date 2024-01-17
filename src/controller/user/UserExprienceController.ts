import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import userExprience from '../../model/userExprience';
import { IUserExprienceReqBody, IUserExprienceUpdate } from '../../@types/userExprienceTypes';

const userExprienceController = {
    async addUserExprience(req: any, res: Response, next: NextFunction) {
        const userExprienceSchema = Joi.object({
            skills: Joi.array().required(),
            companyName: Joi.string().required(),
            designation: Joi.string().required(),
            experience: Joi.string().required(),
            anualSalary: Joi.string(),
            type: Joi.string(),
            startDate: Joi.date().required(),
            endDate: Joi.date(),
            jobProfile: Joi.string().required()
        });

        const { error } = userExprienceSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { skills, companyName, designation, experience, anualSalary, type, startDate, endDate, jobProfile }: IUserExprienceReqBody = req.body;



        const userExpriences = new userExprience({
            userId: req.user.id,
            skills,
            companyName,
            designation,
            experience,
            anualSalary,
            type,
            startDate,
            endDate,
            jobProfile
        });

        try {
            const addUserExp = await userExpriences.save();
            if (addUserExp) {
                return res.status(200).json({ msg: "User Exprience Added Successfully" })
            }
        } catch (error) {
            console.log(error);
            return next(error);
        }
    },

    async viewUserExprience(req: any, res: Response, next: NextFunction) {
        try {
            const userExpriences = await userExprience.find({ userId: req.user.id }).select("-__v -userId -createdAt -updatedAt");
            return res.status(200).json(userExpriences);
        } catch (error) {
            return next(error)
        }
    },

    async updateUserExprience(req: any, res: Response, next: NextFunction) {
        const userExprienceSchema = Joi.object({
            skills: Joi.array(),
            companyName: Joi.string(),
            designation: Joi.string(),
            experience: Joi.string(),
            anualSalary: Joi.string(),
            type: Joi.string(),
            startDate: Joi.date(),
            endDate: Joi.date(),
            jobProfile: Joi.string()
        })

        const { error } = userExprienceSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { skills, companyName, designation, experience, anualSalary, type, startDate, endDate, jobProfile }: IUserExprienceUpdate = req.body;

        const expId = req.params.id;

        try {
            const editUserExp = await userExprience.findOneAndUpdate({
                _id: expId,
                userId: req.user.id,
            }, {
                skills,
                companyName,
                designation,
                experience,
                anualSalary,
                type,
                startDate,
                endDate,
                jobProfile
            }, {
                new: true
            });

            if (editUserExp) {
                return res.status(200).json({ msg: "user updated Successfully" })
            } else {
                return res.status(500).json({ msg: "Something went wrong" })
            }
        } catch (error) {
            return next(error);
        }
    },

    async deleteUserExperience(req: any, res: Response, next: NextFunction) {
        const expId = req.params.id;

        try {
            const deleteUserExp = await userExprience.findOneAndDelete({
                _id: expId,
                userId: req.user.id
            });

            if (!deleteUserExp) {
                return res.status(404).json({ msg: "Exprience not found" })
            }

            return res.status(200).json({ msg: "User Exprience Deleted Successfully" });
        } catch (error) {
            return next(error);
        }
    }

}

export default userExprienceController;