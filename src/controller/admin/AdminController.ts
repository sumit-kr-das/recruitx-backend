import { Request, Response, NextFunction, response } from 'express';
import company from '../../model/company';
import User from '../../model/User';
import job from '../../model/job';
import applier from '../../model/applier';
import admin from '../../model/admin';
import redisClient from '../../utils/redisClient';
import companyStatus from '../../services/conpanyStatusService';
import userStatus from '../../services/userStatusService';

const adminController = {
    async viewAdmin(req: any, res: Response, next: NextFunction) {
        const id = req.user.id;
        try {
            const admins = await admin
                .findById({ _id: id })
                .select('-__v -password');
            return res.status(200).json(admins);
        } catch (error) {
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
                .find({ status: approve }).populate("companyProfileId", "logo")
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
            comp.status = companyStatus.APPROVED;
            await comp.save();
            return res.status(200).json({ msg: 'Company approved' });
        } catch (error) {
            next(error);
        }
    },

    async restrictCompany(req: Request, res: Response, next: NextFunction) {
        const companyId = req.params.companyId;
        try {
            const companyData = await company.findById(companyId);
            if (!companyData) {
                return res.status(404).json({ message: "Company not found" });
            }
            await company.findOneAndUpdate(
                { _id: companyId },
                { status: companyStatus.BLOCK },
                { returnOriginal: false },
            );
            return res.status(200).json({ message: "Company has been blocked successfully" })
        } catch (error) {
            next(error);
        }
    },

    async restrictUser(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.userId;
        try {
            const userData = await User.findById(userId);
            if (!userData) {
                return res.status(404).json({ message: "User not found" });
            }
            await User.findOneAndUpdate(
                { _id: userId },
                { status: userStatus.BLOCK },
                { returnOriginal: false }
            );
            return res.status(200).json({ message: "User has been restricted" });
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
