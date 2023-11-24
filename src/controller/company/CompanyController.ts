import { Response, Request, NextFunction } from "express";
import company from "../../model/company";
import { MulterService } from "../../services/multerService";
import Joi, { object } from "joi";
import CustomErrorHandler from "../../services/customErrorHandeler";
import path from "path";
import fs from "fs";

const companyController = {
    async viewCompanies(req:Request, res:Response, next:NextFunction){
        const {limit, ...others }:{ limit?: number; [key: string]: any } = req.query;

        try {
            if(limit){
                const companies = await company.find({...others}).limit(limit).sort({rating:1}).select("-__v -password -createdAt -updatedAt");
                return res.status(200).json(companies);

            }else{
               const companies = await company.find({...others}).sort({rating:1}).select("-__v -password -createdAt -updatedAt");
               return res.status(200).json(companies);

            }
           
        } catch (error) {
            next(error)
        }
    },

    async viewCompanyDetails(req:Request, res:Response, next:NextFunction){
        const companyId = req.params.id;
        try {
            const companyDetail = await company.findOne({_id:companyId}).select("-__v -updatedAt");
            return res.status(200).json(companyDetail);
        } catch (error) {
            next(error)
        }
    },

    // async editCompany(req: any, res: Response, next: NextFunction) {
    //     const companyId = req.company.id;
    //     MulterService(req, res, async (err) => {
    //         const companyEditSchema = Joi.object({
    //             name: Joi.string().min(5).max(40),
    //             description: Joi.string().min(10),
    //             teamSize: Joi.number().min(1),
    //             type: Joi.string(),
    //             rating: Joi.number(),
    //         });
    
    //         const { error } = companyEditSchema.validate(req.body);
    
    //         if (error) {
    //             next(error);
    //         }
    
    //         if (err) {
    //             return next(CustomErrorHandler.serverError(err.message));
    //         }

    //         const companyToUpdate = await company.findById(companyId);
    
    //         if (!companyToUpdate) {
    //             return res.status(404).json({ error: "Company not found" });
    //         }

    //         let filePath = '';
    //         if (req.file) {
    //             filePath = req.file.path;
    //             const fileExtension = path.extname(filePath);
    //             if (
    //                 fileExtension !== '.jpg' &&
    //                 fileExtension !== '.png' &&
    //                 fileExtension !== '.jpeg'
    //             ) {
    //                 return res
    //                     .status(401)
    //                     .json({ msg: 'File type is not valid' });
    //             }

    //             if(companyToUpdate.logo){
    //                 fs.unlink(`http://localhost:3000/${companyToUpdate.logo}`,(error)=>{
    //                     console.log("image deleted");
    //                 });
    //             }
    //         }else{
    //             filePath = companyToUpdate.logo;
    //         }

    //         companyToUpdate.name = req.body.name || companyToUpdate.name;
    //         companyToUpdate.description = req.body.description || companyToUpdate.description;
    //         companyToUpdate.teamSize = req.body.teamSize || companyToUpdate.teamSize;
    //         companyToUpdate.type = req.body.type || companyToUpdate.type;
    //         companyToUpdate.rating = req.body.rating || companyToUpdate.rating;
    //         companyToUpdate.logo = filePath;
            
        
    //         try{
    
    //             const updatedCompany = await companyToUpdate.save();
    
    //             res.status(200).json({ msg: "Company information updated successfully" });
    //         } catch (error) {
    //             next(error);
    //         }
    //     });
    // }
    


}

export default companyController;