import { Response, Request, NextFunction } from "express";
import job from "../../model/job";
import Joi from "joi";

const searchJobController = {
    async searchJob(req: Request, res: Response, next: NextFunction) {
        const searchSchema = Joi.object({
            title: Joi.string().required(),
            location: Joi.string(),
            exprience: Joi.number()
        });

        const { error } = searchSchema.validate(req.body);

        if (error) {
            next(error);
        }

        const { title, location, exprience }: { title: string, location: string, exprience: string } = req.body;

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
        } else {
            return res.status(503).json({ msg: "Invalid input" })
        }

        try {
            const jobs = await job.find(query);
            return res.status(200).json(jobs);
        } catch (error) {
            next(error);
        }

    },

    async searchByTags(req: Request, res: Response, next: NextFunction) {
        const tag = req.query.tag
        try {
            const jobs = await job.find({ tags: tag })
            return  res.status(200).json({ jobs })
        } catch (error) {
            next(error);
        }
     
    },

    async searchBySkill(req:Request, res:Response, next:NextFunction){
        const skill = req.query.skill

        try {
            const jobs = await job.find({ 'info.skills': skill })
            return res.status(200).json({ jobs });
        } catch (error) {
            next(error);
        }
      
    }

}

export default searchJobController;