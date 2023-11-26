import { Response, NextFunction } from 'express';
import Joi from 'joi';
import userInfo from '../../model/userInfo';

const userInfoController = {
    async addUseInfo(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;
        try {
            const data = await userInfo.find({ userId });
            if (data.length>0) {
                return res
                    .status(503)
                    .json({ msg: 'User information already exists' });
            }
        } catch (error) {
            next(error);
        }
       

        const userinfoSchema = Joi.object({
            github: Joi.string(),
            linkedIn: Joi.string(),
            dateOfBirth: Joi.string().required(),
            age: Joi.number().required(),
            address: Joi.string().required(),
            bio: Joi.string().required(),
            objective: Joi.string().required(),
            language: Joi.array().required(),
            gender: Joi.string().required(),
            skills: Joi.array().required(),
            maxQualification: Joi.string().required(),
        });

        const { error } = userinfoSchema.validate(req.body);

        if (error) {
            next(error);
        }

        let photo:string;

        if (!req.file) {
           photo = "";
        }else{
            photo = req.file?.path;
        }

        const {
            github,
            linkedIn,
            dateOfBirth,
            age,
            address,
            bio,
            objective,
            language,
            gender,
            skills,
            maxQualification,
        }: {
            github: string;
            linkedIn: string;
            dateOfBirth: Date;
            age: number;
            address: string;
            bio: string;
            objective: string;
            language: [string];
            gender: string;
            skills: [string];
            maxQualification: string;
        } = req.body;

        const newUserinfo = new userInfo({
            github,
            linkedIn,
            dateOfBirth,
            age,
            address,
            bio,
            objective,
            language,
            gender,
            skills,
            photo: photo,
            userId,
            maxQualification,
        });

        try {
            await newUserinfo.save();
            return res
                .status(200)
                .json({ msg: 'Your informations saved successfully' });
        } catch (error) {
            next(error);
        }
    },

    async viewUserinfo(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;
        console.log(userId);
        try {
            const info = await userInfo.find({ userId: userId });
            console.log(info);
            return res.status(200).json(info);
        } catch (error) {
            next(error);
        }
    },

    async updateUserinfo(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;

        const userinfoSchema = Joi.object({
            github: Joi.string(),
            linkedIn: Joi.string(),
            dateOfBirth: Joi.string(),
            age: Joi.number(),
            address: Joi.string(),
            bio: Joi.string(),
            objective: Joi.string(),
            language: Joi.array(),
            gender: Joi.string(),
            skills: Joi.array(),
            maxQualification: Joi.string(),
        });

        const { error } = userinfoSchema.validate(req.body);

        if (error) {
            next(error);
        }
        let photo:string;

        if (!req.file) {
           photo = "";
        }else{
            photo = req.file?.path;
        }

        const {
            github,
            linkedIn,
            dateOfBirth,
            age,
            address,
            bio,
            objective,
            language,
            gender,
            skills,
            maxQualification,
        }: {
            github: string;
            linkedIn: string;
            dateOfBirth: Date;
            age: number;
            address: string;
            bio: string;
            objective: string;
            language: [string];
            gender: string;
            skills: [string];
            maxQualification: string;
        } = req.body;

        const updateFields: {
            github: string;
            linkedIn: string;
            dateOfBirth: Date;
            age: number;
            address: string;
            bio: string;
            objective: string;
            language: [string];
            gender: string;
            skills: [string];
            photo?: string;
            maxQualification: string;
        } = {
            github,
            linkedIn,
            dateOfBirth,
            age,
            address,
            bio,
            objective,
            language,
            gender,
            skills,
            maxQualification,
        };


       updateFields.photo = photo;

        try {
            const updatedInfo = await userInfo.findOneAndUpdate(
                { userId },
                updateFields,
                { new: true },
            );

            if (!updatedInfo) {
                return res
                    .status(404)
                    .json({ msg: 'User information not found' });
            }

            return res.status(200).json({
                msg: 'Your information updated successfully',
                data: updatedInfo,
            });
        } catch (error) {
            next(error);
        }
    },
};

export default userInfoController;
