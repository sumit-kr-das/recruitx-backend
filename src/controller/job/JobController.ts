import { Response, Request, NextFunction } from 'express';
import Joi from 'joi';
import job from '../../model/job';
const jobController = {
    async postJob(req: any, res: Response, next: NextFunction) {
        const jobSchema = Joi.object({
            title: Joi.string().min(10).max(100).required(),
            category: Joi.string().required(),
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
        }: {
            title: string;
            category: string;
            description: string;
            tags: [string];
            active?: boolean;
            info: {
                vacancies: number;
                education: string;
                jobType: string;
                workplaceType: string;
                startDate: Date;
                endDate: Date;
                roles: string;
                skills: [string];
                minExprience: number;
                maxExprience: number;
                minSalary: number;
                maxSalary: number;
                location: string;
                maxQualification: string;
                degree: string;
            };
        } = req.body;

        const jobs = new job({
            title,
            category,
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
            // console.log(error);
            return next(error);
        }
    },

    async viewJobs(req: any, res: Response, next: NextFunction) {
        // const limit = req.query.limit;
        const { limit, ...others }: { limit?: number;[key: string]: any } = req.query;

        try {
            if (limit) {
                const jobs = await job
                    .find({ companyId: req.user.id, ...others })
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .select('-__v -createdAt -updatedAt');
                return res.status(200).json(jobs);
            } else {
                const jobs = await job
                    .find({ companyId: req.user.id, ...others })
                    .sort({ createdAt: -1 })
                    .select('-__v -createdAt -updatedAt');
                return res.status(200).json(jobs);
            }
        } catch (error) {
            return next(error);
        }
    },

    // async viewJobsFeed(req:Request, res:Response, next:NextFunction){
    //     try {
    //         const jobs = await job.find().sort({createdAt:-1}).select("-__v -updatedAt");
    //         return res.status(200).json(jobs);
    //     } catch (error) {
    //         next(error)
    //     }
    // },

    async editJob(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.id;

        const jobSchema = Joi.object({
            title: Joi.string().min(10).max(100).required(),
            category: Joi.string().required(),
            description: Joi.string().min(100).required(),
            tags: Joi.array().required(),
            active: Joi.boolean(),
            info: Joi.object({
                vacancies: Joi.number().required(),
                education: Joi.string().required(),
                type: Joi.string().required(),
                startDate: Joi.date().required(),
                endDate: Joi.date().required(),
                roles: Joi.string().required(),
                skills: Joi.array().required(),
                minExprience: Joi.number().required(),
                maxExprience: Joi.number().required(),
                minSalary: Joi.number(),
                maxSalary: Joi.number(),
                maxQualification: Joi.string().required(),
                degree: Joi.array().required(),
            }),
        });

        const { error } = jobSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {
            title,
            category,
            description,
            tags,
            active,
            info: {
                vacancies,
                type,
                startDate,
                endDate,
                roles,
                skills,
                minExprience,
                maxExprience,
                minSalary,
                maxSalary,
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
                    description,
                    tags,
                    active,
                    companyId: req.user.id,
                    info: {
                        vacancies,
                        type,
                        startDate,
                        endDate,
                        roles,
                        skills,
                        minExprience,
                        maxExprience,
                        minSalary,
                        maxSalary,
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
};

export default jobController;
