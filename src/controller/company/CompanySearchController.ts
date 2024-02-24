import { Request, Response, NextFunction } from "express";
import company from "../../model/company";

const companySearchController = {
    async searchCompany(req: any, res: Response, next: NextFunction) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const search = req.query.search || '';
            const page = parseInt(req.query.page) - 1 || 0;
            const companies = await company.find({ companyName: { $regex: search, $options: 'i' }, status: "approved" }).skip(page * limit).limit(limit).populate({
                path: 'companyProfileId',
                select: 'logo type'
            }).select('-__v -password -createdAt -updatedAt -role -approve -designation');

            const total = await company.countDocuments({ companyName: { $regex: search, $options: 'i' }, status: "approved" });
            const response = {
                total,
                companies,
                limit
            }
            return res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}

export default companySearchController;