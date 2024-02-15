import { Request, Response, NextFunction } from "express";
import User from "../../model/User";
import job from "../../model/job";
import company from "../../model/company";
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
        const role = req.params.role;
        const today = new Date(); // Assuming this is the current date
        try {
            let totalJobs, activeJobs, expiredJobs, totalReviews;
            if (role === "company") {
                totalJobs = await job.countDocuments({ companyId });
                activeJobs = await job.countDocuments({ companyId, active: true, 'info.endDate': { $gte: today } });
                expiredJobs = await job.countDocuments({ companyId, 'info.endDate': { $lte: today } });
                totalReviews = await rating.countDocuments({ companyId });
            } else {
                totalJobs = await job.countDocuments();
                activeJobs = await job.countDocuments({ active: true, 'info.endDate': { $gte: today } });
                expiredJobs = await job.countDocuments({ 'info.endDate': { $lte: today } });
                totalReviews = await rating.countDocuments();
            }

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