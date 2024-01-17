import { Request, Response, NextFunction, response } from 'express';
import company from '../../model/company';
import User from '../../model/User';
import job from '../../model/job';
import applier from '../../model/applier';
import admin from '../../model/admin';
import redisClient from '../../utils/redisClient';

const adminController = {
    async viewAdmin(req: any, res: Response, next: NextFunction) {
        const id = req.user.id;
        try {
            const admins = await admin
                .findById({ _id: id })
                .select('-__v -password');
            return res.status(200).json(admins);
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async viewCompaniesWithStatus(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        const approve = req.query.approve;
        try {
            const companies = await company
                .find({ approve: approve })
                .select('-_v -password');
            return res.status(200).json(companies);
        } catch (error) {
            next(error);
        }
    },

    async approveCompany(req: Request, res: Response, next: NextFunction) {
        const companyId = req.params.companyId;
        try {
            const checkCacheCompany = await redisClient.get('companies');
            if (checkCacheCompany) {
                await redisClient.del('companies');
            }
            const comp = await company.findById(companyId);
            if (!comp) {
                return res.status(404).json({ msg: 'company not found' });
            }
            comp.approve = true;
            await comp.save();
            return res.status(200).json({ msg: 'Company approved' });
        } catch (error) {
            next(error);
        }
    },

    async viewAdminStatics(req: Request, res: Response, next: NextFunction) {
        try {
            const totalCompany = await company.countDocuments();
            const totalUser = await User.countDocuments();
            const totalJobs = await job.countDocuments();
            const totalApplications = await applier.countDocuments();

            const adminStats = {
                totalCompany,
                totalUser,
                totalJobs,
                totalApplications,
            }
            return res.status(200).json(adminStats);
        } catch (error) {
            next(error);
        }
    },
};

export default adminController;
