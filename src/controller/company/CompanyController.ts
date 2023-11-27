import { Response, Request, NextFunction } from 'express';
import company from '../../model/company';
import { MulterService } from '../../services/multerService';
import Joi, { object, string } from 'joi';
import CustomErrorHandler from '../../services/customErrorHandeler';
import path from 'path';
import fs from 'fs';

const companyController = {
    async viewCompanies(req: Request, res: Response, next: NextFunction) {
        const { limit, ...others }: { limit?: number; [key: string]: any } =
            req.query;

        try {
            if (limit) {
                const companies = await company
                    .find({ ...others, approve: true })
                    .limit(limit)
                    .sort({ rating: 1 })
                    .select('-__v -password -createdAt -updatedAt');
                return res.status(200).json(companies);
            } else {
                const companies = await company
                    .find({ ...others })
                    .sort({ rating: 1 })
                    .select('-__v -password -createdAt -updatedAt');
                return res.status(200).json(companies);
            }
        } catch (error) {
            next(error);
        }
    },

    async viewCompany(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;

        try {
            const companyDetail = await company
                .findOne({ _id: companyId })
                .select('-__v');
            return res.status(200).json(companyDetail);
        } catch (error) {
            next(error);
        }
    },

    async viewCompanyDetails(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        try {
            const companyDetail = await company
                .findOne({ _id: companyId })
                .select('-__v -updatedAt');
            return res.status(200).json(companyDetail);
        } catch (error) {
            next(error);
        }
    },

    async editCompany(req:any, res:Response, next:NextFunction){
        const companyId = req.user.id;

        const companySchema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            phone:Joi.string().min(10),
            companyName: Joi.string(),
            industry: Joi.string(),
            designation: Joi.string(),
            pin: Joi.string(),
            address: Joi.string(),
        });

        const {error} = companySchema.validate(req.body);

        if(error){
            next(error);
        }

        const {name, email, phone, companyName, industry, designation, pin, address}:{name?:string, email?:string, phone?:string, companyName?:string, industry?:string, designation?: string, pin?:string, address?:string} = req.body;

        const oldCompany = await company.findById(companyId);

        if(!oldCompany){
            return res.status(404).json({msg:"No company found"});
        }

        const updateData = {
            name: name || oldCompany.name,
            email: email || oldCompany.email,
            phone: phone || oldCompany.phone,
            companyName: companyName || oldCompany.companyName,
            designation: designation || oldCompany.designation,
            pin: pin || oldCompany.pin,
            address: address || oldCompany.address
        };

        try {
            const updateCompany = await company.findOneAndUpdate({_id: companyId}, updateData, { returnOriginal: false });
            return res.status(200).json({msg:"Company updated successfully"});
        } catch (error) {
            next(error)
        }
    },
};

export default companyController;
