import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import User from "../../model/User";
import job from "../../model/job";
import userInfo from "../../model/userInfo";

const jobRecomandationController = {
    async recommendJobs(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;

        const userSkills: any = await userInfo.find({ userId });
        const skill = userSkills[0]?.skills;
        const currentDate = new Date();
        console.log(currentDate);


        try {
            const jobs = await job.find({
                                                                                                            
                'info.skills': {
                    $elemMatch: {
                        $in: skill,
                    },
                },
                active: true,
                'info.startDate': { $lte: currentDate },
                'info.endDate': { $gte: currentDate },
            });
            return res.status(200).json(jobs);
        } catch (error) {
            console.log(error);
            next(error);
        }

    },
}

export default jobRecomandationController;