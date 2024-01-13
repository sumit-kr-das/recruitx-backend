import { NextFunction, Response } from 'express';
import Joi from 'joi';
import {
    ICompanyProfileReqBody,
    ICompanyProfileUpdate,
} from '../../@types/companyProfileTypes';
import company from '../../model/company';
import companyProfile from '../../model/companyProfile';
import redisClient from '../../utils/redisClient';

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
            return next(error);
        }

        let logo;

        if (!req.file) {
            logo = '';
        } else {
            logo = req.file.path;
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
            logo,
            teamSize,
            type,
            tags,
            founded,
        });

        try {
            const saveProfile = await profile.save();
            return res.status(200).json({ msg: 'profile added' });
        } catch (error) {
            console.log(error);
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

        if (!oldProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        let logo;

        if (req.file) {
            logo = req.file.path;
        } else {
            logo = oldProfile?.logo;
        }

        const profile = {
            companyId,
            description: description || oldProfile.description,
            teamSize: teamSize || oldProfile.teamSize,
            type: type || oldProfile.type,
            tags: tags || oldProfile.tags,
            founded: founded || oldProfile.founded,
            logo: logo,
        };

        try {
            const updatedProfile = await companyProfile.findOneAndUpdate(
                { companyId },
                profile,
                { returnOriginal: false },
            );
            const companyProfileKey = JSON.stringify({
                companyProfile: companyId,
            });
            const companyProfileCache = await redisClient.get(
                companyProfileKey,
            );
            if (companyProfileCache) {
                await redisClient.del(companyProfileKey);
            }
            return res.status(200).json({ message: 'Profile updated' });
        } catch (error) {
            console.log(error);
            return next(error);
        }
    },

    async viewProfile(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        try {
            const cacheKey = `companyProfile:${companyId}`;
            const companyProfileCache = await redisClient.get(cacheKey);
            console.log(companyProfileCache);
            if (companyProfileCache) {
                return res.status(200).json(JSON.parse(companyProfileCache));
            }
            const profile = await companyProfile
                .findOne({ companyId })
                .select('-_id -companyId');
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found' });
            }
            await redisClient.set(cacheKey, JSON.stringify(profile));
            // await redisClient.expire(cacheKey, 20);

            return res.status(200).json(profile);
        } catch (error) {
            console.log(error);
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
