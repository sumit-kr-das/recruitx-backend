import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import userEducationDetail from '../../model/userEducationDetail';
import { IUserEducationReqBody } from '../../@types/userEducationTypes';

const userEducationController = {
    async addUserEducation(req: any, res: Response, next: NextFunction) {
        const userEducationSchema = Joi.object({
            degree: Joi.string().required(),
            college: Joi.string().required(),
            course: Joi.string().required(),
            admissionYear: Joi.number().integer().required(),
            passYear: Joi.number().integer().required(),
            marks: Joi.number().required(),
            courseType: Joi.string().required()
        })

        const { error } = userEducationSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { degree, college, course, admissionYear, passYear, marks, courseType }: IUserEducationReqBody = req.body;

        const userEducation = new userEducationDetail({
            userId: req.user.id,
            degree,
            college,
            course,
            admissionYear,
            passYear,
            marks,
            courseType
        });

        try {
            const saveUserEducation = await userEducation.save();
            if (saveUserEducation) {
                return res.status(200).json({ msg: "User Education Added Successfully" });
            }
        } catch (error) {
            console.log(error);
            return next(error);
        }
    },

    async viewUserEducation(req: any, res: Response, next: NextFunction) {
        try {
            const userEducation = await userEducationDetail.find({ userId: req.user.id }).select('-userId -__v  -createdAt -updatedAt');
            return res.status(200).json(userEducation);
        } catch (error) {
            return next(error);
        }
    },

    async editUserEducation(req: any, res: Response, next: NextFunction) {
        const userEducationSchema = Joi.object({
            degree: Joi.string(),
            college: Joi.string(),
            course: Joi.string(),
            admissionYear: Joi.number().integer(),
            passYear: Joi.number().integer(),
            marks: Joi.number(),
            courseType: Joi.string()
        })

        const { error } = userEducationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { degree, college, course, admissionYear, passYear, marks, courseType }: IUserEducationReqBody = req.body;
        const edId = req.params.id;

        try {
            const updatedUserEducation = await userEducationDetail.findOneAndUpdate(
                {
                    _id: edId,
                    userId: req.user.id,
                },
                {
                    degree,
                    college,
                    admissionYear,
                    passYear,
                    marks,
                    course,
                    courseType
                },
                { new: true }
            );

            if (!updatedUserEducation) {
                return res.status(404).json({ msg: "Education record not found" });
            }

            return res.status(200).json({ msg: "User Education Updated Successfully" });
        } catch (error) {
            return next(error);
        }
    },

    async deleteUserEducation(req: any, res: Response, next: NextFunction) {
        const edId = req.params.id;

        try {
            const deletedUserEducation = await userEducationDetail.findOneAndDelete({
                _id: edId,
                userId: req.user.id,
            });

            if (!deletedUserEducation) {
                return res.status(404).json({ msg: "Education record not found or unauthorized" });
            }

            return res.status(200).json({ msg: "User Education Deleted Successfully" });
        } catch (error) {
            return next(error);
        }
    }
}

export default userEducationController;