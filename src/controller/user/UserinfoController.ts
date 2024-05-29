import { Response, NextFunction } from 'express';
import Joi from 'joi';
import userInfo from '../../model/userInfo';
import { IUserinfoReqBody } from '../../@types/userInfoTypes';
import fs from 'fs';
import { destroyOnCloudnary, uploadOnCloudnary } from '../../utils/cloudnary';
import logger from '../../utils/logger';

const userInfoController = {
    async addUseInfo(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;

        try {
            const data = await userInfo.find({ userId });
            if (data.length > 0) {
                return res
                    .status(503)
                    .json({ msg: 'User information already exists' });
            }
        } catch (error) {
            return next(error);
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
            if (req?.file?.path) {
                fs.unlinkSync(req.file.path);
            }
            return next(error);
        }

        let cloudnaryResponse;
        if (req?.file?.path) {
            cloudnaryResponse = await uploadOnCloudnary(req?.file?.path);
            if (!cloudnaryResponse) {
                return res
                    .status(404)
                    .json({ message: 'User image is required' });
            }
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
        }: IUserinfoReqBody = req.body;

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
            photo: cloudnaryResponse?.url || '',
            userId,
            maxQualification,
        });

        try {
            await newUserinfo.save();
            res.status(200).json({
                msg: 'Your informations saved successfully',
            });
            fs.unlinkSync(req?.file?.path);
        } catch (error) {
            fs.unlinkSync(req?.file?.path);
            return next(error);
        }
    },

    async viewUserinfo(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;
        try {
            const info = await userInfo.find({ userId: userId });
            return res.status(200).json(info);
        } catch (error) {
            return next(error);
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
            if (req?.file?.path) {
                fs.unlinkSync(req.file.path);
            }
            return next(error);
        }

        const oldProfile = await userInfo.findOne({ userId });
        let cloudnaryResponse;
        if (req?.file?.path) {
            if (oldProfile?.photo) {
                const cloudnaryImageUrl = oldProfile?.photo;
                const urlArray = cloudnaryImageUrl.split('/');
                const url = urlArray[urlArray.length - 1];
                const imgName = url.split('.')[0];
                const cloudinaryDestroyResponse = await destroyOnCloudnary(
                    imgName,
                );
                if (!cloudinaryDestroyResponse) {
                    return res.status(404).json({
                        message: 'User image is not found in cloudnary',
                    });
                }
                logger.info('Image is deleted from cloudnary');
            }
            cloudnaryResponse = await uploadOnCloudnary(req?.file?.path);
            fs.unlinkSync(req?.file?.path);
            if (!cloudnaryResponse) {
                return res
                    .status(404)
                    .json({ message: 'Company logo is required' });
            }
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
        }: IUserinfoReqBody = req.body;

        const updateFields: {
            github?: string;
            linkedIn?: string;
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

        updateFields.photo = cloudnaryResponse?.url || oldProfile?.photo || '';

        try {
            const updatedInfo = await userInfo.findOneAndUpdate(
                { userId },
                updateFields,
                {
                    returnOriginal: false,
                    upsert: true,
                },
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
            fs.unlinkSync(req?.file?.path);
            return next(error);
        }
    },
};

export default userInfoController;
