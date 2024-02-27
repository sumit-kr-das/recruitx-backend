import { NextFunction, Response } from "express";
import job from "../../model/job";
import userInfo from "../../model/userInfo";


const jobRecomandationController = {
    async recommendJobs(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const hasinfo = req.query.hasInfo;
        const limit = req.query.limit;
        const currentDate = new Date();

        try {
            if (hasinfo === "true") {
                const userSkills: any = await userInfo.find({ userId });
                const skill = userSkills[0]?.skills;

                const jobs = await job.find({
                    'info.skills': {
                        $elemMatch: {
                            $in: skill,
                        },
                    },
                    active: true,
                    'info.startDate': { $lte: currentDate },
                    'info.endDate': { $gte: currentDate },
                }).limit(limit).populate({
                    path: 'companyId',
                    select: 'companyName companyProfileId',
                    populate: {
                        path: 'companyProfileId',
                        select: 'logo',
                    },
                });
                return res.status(200).json(jobs);
            } else {
                const jobs = await job.find({
                    active: true,
                    'info.startDate': { $lte: currentDate },
                    'info.endDate': { $gte: currentDate },
                }).limit(limit).populate({
                    path: 'companyId',
                    select: 'companyName companyProfileId',
                    populate: {
                        path: 'companyProfileId',
                        select: 'logo',
                    },
                });
                return res.status(200).json(jobs);
            }

        } catch (error) {
            return next(error);
        }

    },
}

export default jobRecomandationController;