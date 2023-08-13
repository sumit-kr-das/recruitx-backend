import { Response, Request, NextFunction } from "express";
import Joi from "joi";
import job from "../../model/job";
const jobController = {
    async postJob(req:any, res:Response, next:NextFunction){
        const jobSchema = Joi.object({
            title:Joi.string().min(10).max(100).required(),
            category:Joi.string().required(),
            description:Joi.string().min(100).required(),
            tags:Joi.array().required(),
            active:Joi.boolean().required(),
            info:Joi.object({
                vacancies:Joi.number().required(),
                education:Joi.string().required(),
                type:Joi.string().required(),
                startDate:Joi.date().required(),
                endDate:Joi.date().required(),
                roles:Joi.string().required(),
                skills:Joi.array().required(),
                minExprience:Joi.number().required(),
                maxExprience:Joi.number().required(),
                minSalary:Joi.number(),
                maxSalary:Joi.number(),
            }),
        })

        const {error} = jobSchema.validate(req.body);

        if(error){
            next(error);
        }

        const {title, category, description, tags, active, companyId, info:{vacancies, education, type, startDate, endDate, roles,skills,minExprience,maxExprience,minSalary,maxSalary}}:{title:string, category:string, description:string, tags:[string], active:boolean, companyId:string, info:{vacancies:number, education:string, type:string, startDate:Date, endDate:Date, roles:string, skills:[string], minExprience:number, maxExprience:number, minSalary:number, maxSalary:number}} = req.body;
        
        const jobs = new job({
            title,
            category,
            description,
            tags,
            active,
            companyId:req.company.id,
            info:{
                vacancies,
                education,
                type,
                startDate,
                endDate,
                roles,
                skills,
                minExprience,
                maxExprience,
                minSalary,
                maxSalary
            }
        });

        try {
            const addJobs = await jobs.save();
            return res.status(200).json({msg:"Jobs Posted Successfullly"});
        } catch (error) {
            next(error);
        }
    },

    async viewJobs(req:any, res:Response, next:NextFunction){
        try {
            const jobs = await job.find({companyId:req.company.id}).sort({createdAt:-1}).select("-__v, -createdAt, -updatedAt");
            return res.status(200).json(jobs);
        } catch (error) {
            next(error);
        }
    },

    async editJob(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.id;
    
        const jobSchema = Joi.object({
            title: Joi.string().min(10).max(100).required(),
            category: Joi.string().required(),
            description: Joi.string().min(100).required(),
            tags: Joi.array().required(),
            active: Joi.boolean().required(),
            info: Joi.object({
                vacancies: Joi.number().required(),
                education: Joi.string().required(),
                type: Joi.string().required(),
                startDate: Joi.date().required(),
                endDate: Joi.date().required(),
                roles: Joi.string().required(),
                skills: Joi.array().required(),
                minExprience: Joi.number().required(),
                maxExprience: Joi.number().required(),
                minSalary: Joi.number(),
                maxSalary: Joi.number(),
            }),
        });
    
        const { error } = jobSchema.validate(req.body);
    
        if (error) {
           next(error);
        }
    
        const {
            title,
            category,
            description,
            tags,
            active,
            info: {
                vacancies,
                education,
                type,
                startDate,
                endDate,
                roles,
                skills,
                minExprience,
                maxExprience,
                minSalary,
                maxSalary,
            },
        } = req.body;
    
        try {
            const updatedJob = await job.findByIdAndUpdate(
                jobId,
                {
                    title,
                    category,
                    description,
                    tags,
                    active,
                    companyId: req.company.id,
                    info: {
                        vacancies,
                        education,
                        type,
                        startDate,
                        endDate,
                        roles,
                        skills,
                        minExprience,
                        maxExprience,
                        minSalary,
                        maxSalary,
                    },
                },
                { new: true } 
            );
    
            if (!updatedJob) {
                return res.status(404).json({ error: "Job not found" });
            }
    
            return res.status(200).json({ msg: "Job updated successfully" });
        } catch (error) {
            next(error);
        }
    },
    async deleteJob(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.id;
    
        try {
            const deletedJob = await job.findByIdAndDelete(jobId);
    
            if (!deletedJob) {
                return res.status(404).json({ error: "Job not found" });
            }
    
            return res.status(200).json({ msg: "Job deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
    
    
}

export default jobController;