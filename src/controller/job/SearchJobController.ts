import { Response, Request, NextFunction } from "express";
import job from "../../model/job";
import Joi from "joi";
import { ISearchJob } from "../../@types/jobTypes";

const searchJobController = {
    async searchJob(req: Request, res: Response, next: NextFunction) {
        const { limit, ...others }: { limit?: number;[key: string]: any } =
            req.query;
        const searchSchema = Joi.object({
            title: Joi.string().allow(null, ""),
            location: Joi.string().allow(null, ""),
            exprience: Joi.number().allow(null, "")
        });

        const { error } = searchSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { title, location, exprience }: ISearchJob = req.body;


        if (title || location || exprience) {
            let query = {};
            if (title && location && exprience) {
                query = {
                    title: { $regex: title, $options: 'i' },
                    'info.location': { $regex: location, $options: 'i' },
                    'info.minExprience': { $lte: exprience },
                }
            } else if (title && location) {
                query = {
                    title: { $regex: title, $options: 'i' },
                    'info.location': { $regex: location, $options: 'i' },
                }
            } else if (title && exprience) {
                query = {
                    title: { $regex: title, $options: 'i' },
                    'info.minExprience': { $lte: exprience },
                }
            } else if (title) {
                query = {
                    title: { $regex: title, $options: 'i' },
                }
            }
            try {
                const jobs = await job.find({ ...query, ...others });
                return res.status(200).json(jobs);
            } catch (error) {
                return next(error);
            }

        } else {
            const jobs = await job.find({ ...others }).sort({ createdAt: -1 });
            return res.status(200).json(jobs);
        }

    },

    async searchByTags(req: Request, res: Response, next: NextFunction) {
        const tag = req.query.tag
        try {
            const jobs = await job.find({ tags: tag })
            return res.status(200).json({ jobs })
        } catch (error) {
            return next(error);
        }

    },

    async searchBySkill(req: Request, res: Response, next: NextFunction) {
        const skill = req.query.skill

        try {
            const jobs = await job.find({ 'info.skills': skill })
            return res.status(200).json({ jobs });
        } catch (error) {
            return next(error);
        }
    }

}

export default searchJobController;