import { NextFunction, Response } from 'express';
import Joi from 'joi';
import {
    ICompanyProfileReqBody,
    ICompanyProfileUpdate,
} from '../../@types/companyProfileTypes';
import company from '../../model/company';
import companyProfile from '../../model/companyProfile';
import redisClient from '../../utils/redisClient';
import { destroyOnCloudnary, uploadOnCloudnary } from '../../utils/cloudnary';
import fs from 'fs';
import logger from '../../utils/logger';

const companyProfileController = {
    async addProfile(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;

        const verifyProfile = Joi.object({
            description: Joi.string().min(15).required(),
            teamSize: Joi.number().required(),
            type: Joi.string().required(),
            tags: Joi.array().required(),
            founded: Joi.string().required(),
        });

        const { error } = verifyProfile.validate(req.body);

        if (error) {
            if (req?.file?.path) {
                fs.unlinkSync(req.file.path);
            }
            return next(error);
        }

        let cloudnaryResponse;
        if (req?.file?.path) {
            cloudnaryResponse = await uploadOnCloudnary(req?.file?.path);
            fs.unlinkSync(req?.file?.path);
            if (!cloudnaryResponse) {
                return res
                    .status(404)
                    .json({ message: 'Company logo is required' });
            }
        }

        const {
            description,
            teamSize,
            type,
            tags,
            founded,
        }: ICompanyProfileReqBody = req.body;

        const profile = new companyProfile({
            companyId,
            description,
            logo: cloudnaryResponse?.url || '',
            teamSize,
            type,
            tags,
            founded,
        });

        try {
            const saveProfile = await profile.save();
            const companyData = await company.findById(companyId);
            if (companyData) {
                companyData.companyProfileId = saveProfile._id;
                await companyData?.save();
            }
            return res.status(200).json({ msg: 'Profile added' });
        } catch (error) {
            return next(error);
        }
    },

    async editProfile(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;

        const verifyProfile = Joi.object({
            description: Joi.string().min(15),
            teamSize: Joi.number(),
            type: Joi.string(),
            tags: Joi.array(),
            founded: Joi.string(),
        });

        const { error } = verifyProfile.validate(req.body);

        if (error) {
            if (req?.file?.path) {
                fs.unlinkSync(req?.file?.path);
            }
            return next(error);
        }

        const {
            description,
            teamSize,
            type,
            tags,
            founded,
        }: ICompanyProfileUpdate = req.body;

        const oldProfile = await companyProfile.findOne({ companyId });

        // if (!oldProfile) {
        //     return res.status(404).json({ message: 'Profile not found' });
        // }

        let cloudnaryResponse;
        if (req?.file?.path) {
            if (oldProfile?.logo) {
                const cloudnaryImageUrl = oldProfile?.logo;
                const urlArray = cloudnaryImageUrl.split('/');
                const url = urlArray[urlArray.length - 1];
                const imgName = url.split('.')[0];
                const cloudinaryDestroyResponse = await destroyOnCloudnary(
                    imgName,
                );
                if (!cloudinaryDestroyResponse) {
                    return res.status(404).json({
                        message: 'Company logo is not found in cloudnary',
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

        const profile = {
            companyId,
            description: description || oldProfile?.description,
            teamSize: teamSize || oldProfile?.teamSize,
            type: type || oldProfile?.type,
            tags: tags || oldProfile?.tags,
            founded: founded || oldProfile?.founded,
            logo: cloudnaryResponse?.url || oldProfile?.logo,
        };

        try {
            console.log(profile, "profile")
            const updatedData = await companyProfile.findOneAndUpdate({ companyId }, profile, {
                returnOriginal: false,
                upsert: true
            });
            console.log(updatedData, "updated data");
            const companyProfileKey = `companyProfile:${companyId}`;
            // const companyProfileCache = await redisClient.get(
            //     companyProfileKey,
            // );
            // if (companyProfileCache) {
            //     await redisClient.del(companyProfileKey);
            // }
            return res.status(200).json({ message: 'Profile updated', data: updatedData });
        } catch (error) {
            fs.unlinkSync(req?.file?.path);
            return next(error);
        }
    },

    async viewProfile(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        try {
            // const cacheKey = `companyProfile:${companyId}`;
            // const companyProfileCache = await redisClient.get(cacheKey);
            // if (companyProfileCache) {
            //     return res.status(200).json(JSON.parse(companyProfileCache));
            // }
            const profile = await companyProfile
                .findOne({ companyId })
                .select('-_id -companyId -__v');

            // await redisClient.set(cacheKey, JSON.stringify(profile));
            // await redisClient.expire(cacheKey, 3600);

            return res.status(200).json(profile);
        } catch (error) {
            return next(error);
        }
    },

    async viewComapnyAllInfo(req: any, res: Response, next: NextFunction) {
        let companyId;
        if (req.query.id) {
            companyId = req.query.id;
        } else {
            companyId = req.user.id;
        }

        try {
            const companyData = await company
                .findById(companyId)
                .select('-__v -_id -password');
            const profile = await companyProfile
                .find({ companyId })
                .select('-__v -_id');

            const data = {
                name: companyData?.name,
                email: companyData?.email,
                phone: companyData?.phone,
                companyName: companyData?.companyName,
                designation: companyData?.designation,
                industry: companyData?.industry,
                pin: companyData?.pin,
                address: companyData?.address,
                profile,
            };

            return res.status(200).json(data);
        } catch (error) {
            return next(error);
        }
    },
};

export default companyProfileController;
