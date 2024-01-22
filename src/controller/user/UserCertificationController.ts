import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import userCertification from '../../model/userCertification';
import { IUserCertificateReqBody } from '../../@types/userCertificateTypes';
import redisClient from '../../utils/redisClient';

const userCertificationController = {
    async addUserCertificate(req: any, res: Response, next: NextFunction) {
        const userCertificateSchema = Joi.object({
            title: Joi.string().required(),
            source: Joi.string().required(),
            description: Joi.string().required(),
            startDate: Joi.date().required(),
            endDate: Joi.date().required()
        });

        const { error } = userCertificateSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { title, source, description, startDate, endDate }: IUserCertificateReqBody = req.body;

        const userCertificate = new userCertification({
            userId: req.user.id,
            title,
            source,
            description,
            startDate,
            endDate
        });

        try {
            const allUserInfoCacheKey = `allUserInfo:${req.user.id}`;
            const certificateCacheKey = `userCertificate:${req.user.id}`;
            await redisClient.del(allUserInfoCacheKey);
            await redisClient.del(certificateCacheKey);
            const addCertificate = await userCertificate.save();
            if (addCertificate) {
                return res.status(200).json({ msg: "Certificate Added Successfully" });
            }
        } catch (error) {
            return next(error)
        }
    },

    async viewCerficates(req: any, res: Response, next: NextFunction) {
        const cacheKey = `userCertificate:${req.user.id}`;
        const certificateCache = await redisClient.get(cacheKey);
        if (certificateCache) {
            return res.status(200).json(JSON.parse(certificateCache));
        }
        try {
            const certificates = await userCertification.find({ userId: req.user.id }).select('-__v -userId');
            await redisClient.set(cacheKey, JSON.stringify(certificateCache));
            return res.status(200).json(certificates);
        } catch (error) {
            next(error);
        }

    },

    async editCertificate(req: any, res: Response, next: NextFunction) {
        const certificateSchema = Joi.object({
            title: Joi.string(),
            source: Joi.string(),
            description: Joi.string(),
            startDate: Joi.date(),
            endDate: Joi.date(),
        });

        const { error } = certificateSchema.validate(req.body);

        if (error) {
            next(error);
            return;
        }

        const { title, source, description, startDate, endDate }: {
            title?: string,
            source?: string,
            description?: string,
            startDate?: Date,
            endDate?: Date,
        } = req.body;

        try {
            const certificateId = req.params.id;
            const updatedCertificate = await userCertification.findOneAndUpdate(
                { _id: certificateId, userId: req.user.id },
                {
                    title,
                    source,
                    description,
                    startDate,
                    endDate,
                },
                { new: true }
            );

            if (updatedCertificate) {
                const allUserInfoCacheKey = `allUserInfo:${req.user.id}`;
                const certificateCacheKey = `userCertificate:${req.user.id}`;
                await redisClient.del(allUserInfoCacheKey);
                await redisClient.del(certificateCacheKey);
                res.status(200).json({ msg: "Certificate updated successfully" });
            } else {
                res.status(404).json({ msg: "Certificate not found" });
            }
        } catch (error) {
            return next(error);
        }
    },

    async deleteCertificate(req: any, res: Response, next: NextFunction) {
        try {
            const certificateId = req.params.id;
            const deletedCertificate = await userCertification.findOneAndDelete({
                _id: certificateId,
                userId: req.user.id,
            });

            if (deletedCertificate) {
                const allUserInfoCacheKey = `allUserInfo:${req.user.id}`;
                const certificateCacheKey = `userCertificate:${req.user.id}`;
                await redisClient.del(allUserInfoCacheKey);
                await redisClient.del(certificateCacheKey);
                res.status(200).json({ msg: "Certificate deleted successfully" });
            } else {
                res.status(404).json({ msg: "Certificate not found" });
            }
        } catch (error) {
            return next(error);
        }
    }
}

export default userCertificationController;