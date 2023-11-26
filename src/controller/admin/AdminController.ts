import { Request, Response, NextFunction, response } from "express";
import company from "../../model/company";
import User from "../../model/User";
import job from "../../model/job";
import applier from "../../model/applier";

const adminController = {
    async viewCompaniesWithStatus(req:Request, res:Response, next:NextFunction){
        const approve = req.query.approve;
        try {
            const companies = await company.find({approve}).select("-_v -password");
            return res.status(200).json(companies);
        } catch (error) {
            next(error);
        }
    },

    async approveCompany(req:Request, res:Response, next:NextFunction){
        const companyId = req.params.companyId;
       try {
        const comp = await company.findById(companyId);
        if(!comp){
            return res.status(404).json({msg:"company not found"});
        }
        comp.approve = true;
        await comp.save()
        return res.status(200).json({msg:"Company approved"});

       } catch (error) {
        next(error);
       }
    },
    // async viewUsersByAdmin(){
    //     const 
    // },
    async viewAdminStatics(req:Request, res:Response, next:NextFunction){
        try {
            const totalCompany = await company.countDocuments();
            const totalUser = await User.countDocuments();
            const totalJobs = await job.countDocuments();
            const totalApplications = await applier.countDocuments();

            return res.status(200).json({
                totalCompany,
                totalUser,
                totalJobs,
                totalApplications
            });

        } catch (error) {
            next(error);
        }
    },
}

export default adminController;