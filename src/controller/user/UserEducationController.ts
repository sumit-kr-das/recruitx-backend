import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import userEducationDetail from '../../model/userEducationDetail';

const userEducationController = {
    async addUserEducation(req: any, res: Response, next: NextFunction) {
        const userEducationSchema = Joi.object({
            degree: Joi.string().required(),
            college: Joi.string().required(),
            duration: Joi.object({
                admissionYear: Joi.number().integer().required(),
                passYear: Joi.number().integer().required(),
            }).required(),
            marks: Joi.number().required(),
        })

        const { error } = userEducationSchema.validate(req.body);

        if (error) {
            next(error);
        }

        const { degree, college, duration: { admissionYear, passYear }, marks }: { degree: string, college: string, duration: { admissionYear: string, passYear: number }, marks: number } = req.body;

        const userEducation = new userEducationDetail({
            userId: req.user.id,
            degree,
            college,
            duration: {
                admissionYear,
                passYear
            },
            marks
        });

        try {
            const saveUserEducation = await userEducation.save();
            if (saveUserEducation) {
                return res.status(200).json({ msg: "User Education Added Successfully" });
            }
        } catch (error) {
            next(error);
        }
    },

    async viewUserEducation(req: any, res: Response, next: NextFunction) {
        try {
            const userEducation = await userEducationDetail.find({ userId: req.user.id }).select('-userId -__v  -createdAt -updatedAt');
            return res.status(200).json(userEducation);
        } catch (error) {
            next(error);
        }
    },

    async editUserEducation(req: any, res: Response, next: NextFunction) {
        const userEducationSchema = Joi.object({
            degree: Joi.string().required(),
            college: Joi.string().required(),
            duration: Joi.object({
                admissionYear: Joi.number().integer().required(),
                passYear: Joi.number().integer().required(),
            }).required(),
            marks: Joi.number().required(),
        });

        const { error } = userEducationSchema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { degree, college, duration: { admissionYear, passYear }, marks } = req.body;
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
                    duration: {
                        admissionYear,
                        passYear,
                    },
                    marks,
                },
                { new: true }
            );

            if (!updatedUserEducation) {
                return res.status(404).json({ msg: "Education record not found" });
            }

            return res.status(200).json({ msg: "User Education Updated Successfully" });
        } catch (error) {
            next(error);
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
            next(error);
        }
    }
}

export default userEducationController;