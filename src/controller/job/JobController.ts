import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
import job from '../../model/job';
import redisClient from '../../utils/redisClient';
import { IJobReqBody } from '../../@types/jobTypes';
const jobController = {
    async postJob(req: any, res: Response, next: NextFunction) {
        const jobSchema = Joi.object({
            title: Joi.string().min(10).max(100).required(),
            category: Joi.string().required(),
            shortDescription: Joi.string().min(30).required(),
            description: Joi.string().min(100).required(),
            tags: Joi.array().required(),
            active: Joi.boolean(),
            info: Joi.object({
                vacancies: Joi.number().required(),
                jobType: Joi.string().required(),
                workplaceType: Joi.string().required(),
                startDate: Joi.date().required(),
                endDate: Joi.date().required(),
                roles: Joi.string().required(),
                skills: Joi.array().required(),
                minExprience: Joi.number().required(),
                maxExprience: Joi.number().required(),
                minSalary: Joi.number(),
                maxSalary: Joi.number(),
                location: Joi.string().required(),
                maxQualification: Joi.string().required(),
                degree: Joi.string().required(),
            }),
        });

        const { error } = jobSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {
            title,
            category,
            shortDescription,
            description,
            tags,
            active,
            info: {
                vacancies,
                jobType,
                workplaceType,
                startDate,
                endDate,
                roles,
                skills,
                minExprience,
                maxExprience,
                minSalary,
                maxSalary,
                location,
                maxQualification,
                degree,
            },
        }: IJobReqBody = req.body;

        const jobs = new job({
            title,
            category,
            shortDescription,
            description,
            tags,
            active,
            companyId: req.user.id,
            info: {
                vacancies,
                jobType,
                workplaceType,
                startDate,
                endDate,
                roles,
                skills,
                minExprience,
                maxExprience,
                minSalary,
                maxSalary,
                location,
                maxQualification,
                degree,
            },
        });

        try {
            const addJobs = await jobs.save();
            return res.status(200).json({ msg: 'Jobs Posted Successfullly' });
        } catch (error) {
            return next(error);
        }
    },

    async viewJobs(req: any, res: Response, next: NextFunction) {
        // const limit = req.query.limit;
        const { limit, ...others }: { limit?: number;[key: string]: any } =
            req.query;

        try {
            if (limit) {
                const jobs = await job
                    .find({ companyId: req.user.id, ...others })
                    .populate({
                        path: 'companyId',
                        select: 'companyName companyProfileId',
                        populate: {
                            path: 'companyProfileId',
                            select: 'logo',
                        },
                    })
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .select('-__v -createdAt -updatedAt');
                return res.status(200).json(jobs);
            } else {
                const jobs = await job
                    .find({ companyId: req.user.id, ...others }).populate({
                        path: 'companyId',
                        select: 'companyName companyProfileId',
                        populate: {
                            path: 'companyProfileId',
                            select: 'logo',
                        },
                    })
                    .sort({ createdAt: -1 })
                    .select('-__v -createdAt -updatedAt');
                return res.status(200).json(jobs);
            }
        } catch (error) {
            return next(error);
        }
    },

    async viewJobsFeed(req: Request, res: Response, next: NextFunction) {
        const limit = Number(req.query.limit);
        try {
            // const checkCacheJobsFeed = await redisClient.get('jobsFeed');
            // if (checkCacheJobsFeed) {
            //     return res.status(200).json(JSON.parse(checkCacheJobsFeed));
            // }
            const jobs = await job
                .find().
                select('-degree -endDate -maxQualification -roles -tags').sort({ createdAt: -1 })
                .limit(limit)
                .select('-__v -updatedAt')
                .populate({
                    path: 'companyId',
                    select: 'companyName companyProfileId',
                    populate: {
                        path: 'companyProfileId',
                        select: 'logo',
                    },
                });
            // await redisClient.set('jobsFeed', JSON.stringify(jobs));
            // await redisClient.expire('jobsFeed', 3600);
            return res.status(200).json(jobs);
        } catch (error) {
            next(error);
        }
    },

    async editJob(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.id;

        const jobSchema = Joi.object({
            title: Joi.string().min(10).max(100).required(),
            category: Joi.string().required(),
            shortDescription: Joi.string().min(30).required(),
            description: Joi.string().min(100).required(),
            tags: Joi.array().required(),
            active: Joi.boolean(),
            info: Joi.object({
                vacancies: Joi.number().required(),
                jobType: Joi.string().required(),
                workplaceType: Joi.string().required(),
                startDate: Joi.date().required(),
                endDate: Joi.date().required(),
                roles: Joi.string().required(),
                skills: Joi.array().required(),
                minExprience: Joi.number().required(),
                maxExprience: Joi.number().required(),
                minSalary: Joi.number(),
                maxSalary: Joi.number(),
                location: Joi.string().required(),
                maxQualification: Joi.string().required(),
                degree: Joi.string().required(),
            }),
        });

        const { error } = jobSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {
            title,
            category,
            shortDescription,
            description,
            tags,
            active,
            info: {
                vacancies,
                jobType,
                workplaceType,
                startDate,
                endDate,
                roles,
                skills,
                minExprience,
                maxExprience,
                minSalary,
                maxSalary,
                location,
                maxQualification,
                degree,
            },
        } = req.body;

        try {
            const updatedJob = await job.findByIdAndUpdate(
                jobId,
                {
                    title,
                    category,
                    shortDescription,
                    description,
                    tags,
                    active,
                    info: {
                        vacancies,
                        jobType,
                        workplaceType,
                        startDate,
                        endDate,
                        roles,
                        skills,
                        minExprience,
                        maxExprience,
                        minSalary,
                        maxSalary,
                        location,
                        maxQualification,
                        degree,
                    },
                },
                { new: true },
            );

            if (!updatedJob) {
                return res.status(404).json({ error: 'Job not found' });
            }

            return res.status(200).json({ msg: 'Job updated successfully' });
        } catch (error) {
            return next(error);
        }
    },

    async deleteJob(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.id;

        try {
            const deletedJob = await job.findByIdAndDelete(jobId);

            if (!deletedJob) {
                return res.status(404).json({ error: 'Job not found' });
            }

            return res.status(200).json({ msg: 'Job deleted successfully' });
        } catch (error) {
            return next(error);
        }
    },

    async deactivateJob(req: any, res: Response, next: NextFunction) {
        try {
            const jobId = req.params.jobId;
            const updatedJob = await job.findByIdAndUpdate(
                jobId,
                { $set: { active: false } },
                { new: true },
            );

            if (!updatedJob) {
                return res.status(404).json({ error: 'Job not found' });
            }

            res.status(200).json({ message: 'Job deactivated successfully' });
        } catch (error) {
            return next(error);
        }
    },

    async getJobStatics(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;

        try {
            const all = await job.countDocuments({ companyId });
            const active = await job.countDocuments({
                companyId,
                active: true,
                'info.endDate': { $gt: new Date() },
            });
            const expired = await job.countDocuments({
                companyId,
                active: true,
                'info.endDate': { $lt: new Date() },
            });

            return res.status(200).json({
                all,
                active,
                expired,
            });
        } catch (error) {
            return next(error);
        }
    },

    async getJobDetails(req: Request, res: Response, next: NextFunction) {
        const jobId = req.params.jobId;
        try {
            const jobDetails = await job.findById(jobId).populate({
                path: 'companyId',
                select: 'companyName pin address companyProfileId',
                populate: {
                    path: 'companyProfileId',
                    select: 'logo',
                },
            });
            return res.status(200).json(jobDetails);
        } catch (error) {
            next(error);
        }
    },

    async viewJobByCompany(req: Request, res: Response, next: NextFunction) {
        const companyId = req.params.companyId;
        try {
            const jobs = await job.find({ companyId }).select('-degree -endDate -maxQualification -roles -tags').sort({ createdAt: -1 })
                .select('-__v -updatedAt')
                .populate({
                    path: 'companyId',
                    select: 'companyName companyProfileId',
                    populate: {
                        path: 'companyProfileId',
                        select: 'logo',
                    },
                });
            return res.status(200).json(jobs);
        } catch (error) {
            next(error);
        }
    }
};

export default jobController;
