import { Request, Response, NextFunction } from "express";
import User from "../../model/User";
import job from "../../model/job";
import company from "../../model/company";
import mongoose from "mongoose";
import applier from "../../model/applier";
import rating from "../../model/rating";

const statsController = {
    async viewStats(req: Request, res: Response, next: NextFunction) {
        try {
            const totalUsers = await User.countDocuments();
            const totalCompanies = await company.countDocuments();
            const totalJobs = await job.countDocuments();
            return res.status(200).json({
                users: totalUsers,
                companies: totalCompanies,
                jobs: totalJobs
            });
        } catch (error) {
            return next(error);
        }
    },

    async companyStats(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        const today = new Date(); // Assuming this is the current date
        try {
            const totalJobs = await job.countDocuments({ companyId });
            const activeJobs = await job.countDocuments({ companyId, active: true, 'info.endDate': { $gte: today } });
            const expiredJobs = await job.countDocuments({ companyId, 'info.endDate': { $lte: today } });
            const totalReviews = await rating.countDocuments({ companyId });
            return res.status(200).json({
                jobs: totalJobs,
                activeJobs,
                expiredJobs,
                totalReviews
            });
        } catch (error) {
            return next(error);
        }
    }
}

export default statsController;