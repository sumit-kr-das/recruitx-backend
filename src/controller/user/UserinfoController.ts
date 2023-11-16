import { Response, NextFunction } from "express";
import Joi from "joi";
import userInfo from "../../model/userInfo";

const userInfoController = {
    async addUseInfo(req:any, res:Response, next:NextFunction){
        const userId = req.user.id;
        const data = await userInfo.find({userId});
        if(data){
            return res.status(503).json({msg:"User information already exists"});
        }
        const userinfoSchema = Joi.object({
            phone: Joi.string().min(10).required(),
            github: Joi.string().required(),
            linkedIn: Joi.string(),
            dateOfBirth: Joi.date().required(),
            age:Joi.number().required(),
            address: Joi.string().required(),
            bio: Joi.string().required(),
            objective : Joi.string().required(),
            status: Joi.string().required(),
            language: Joi.array().required(),
            gender: Joi.string().required(),
            skills: Joi.array().required(),
            maxQualification: Joi.string().required()
        });

        const {error} = userinfoSchema.validate(req.body);

        if(error){
            next(error);
        }

        const photo = req.file;

        if(!photo){
            return res.status(503).json({msg:"Please enter photo"});
        }

        const {phone, github, linkedIn, dateOfBirth, age, address, bio, objective, status, language, gender, skills, maxQualification}:{phone:string, github:string, linkedIn:string, dateOfBirth:Date, age:number, address:string, bio:string, objective:string, status:string, language:[string], gender:string, skills:[string], maxQualification:string} = req.body;

        const newUserinfo = new userInfo({
            phone,
            github,
            linkedIn,
            dateOfBirth,
            age,
            address,
            bio,
            objective,
            status,
            language,
            gender,
            skills,
            photo:photo?.path,
            userId,
            maxQualification
        });

        try {
            const saveInfo = await newUserinfo.save();
            return res.status(200).json({msg:"Your informations saved successfully"});
        } catch (error) {
            next(error);
        }
    },

    async viewUserinfo(req:any, res:Response, next:NextFunction){
        const userId = req.user.id;

        try {
          const info = await userInfo.find({userId});
          return res.status(200).json(info);
        } catch (error) {
          next(error);
        }
    },

    async updateUserinfo(req:any, res:Response, next:NextFunction){
        const userId = req.user.id;


        const userinfoSchema = Joi.object({
            phone: Joi.string().min(10).required(),
            github: Joi.string().required(),
            linkedIn: Joi.string(),
            dateOfBirth: Joi.date().required(),
            age: Joi.number().required(),
            address: Joi.string().required(),
            bio: Joi.string().required(),
            objective: Joi.string().required(),
            status: Joi.string().required(),
            language: Joi.array().required(),
            gender: Joi.string().required(),
            skills: Joi.array().required(),
            maxQualification: Joi.string().required(),
        });
    
        const { error } = userinfoSchema.validate(req.body);
    
        if (error) {
            next(error);
        }
    
        const photo = req.file;
    
        const {
            phone,
            github,
            linkedIn,
            dateOfBirth,
            age,
            address,
            bio,
            objective,
            status,
            language,
            gender,
            skills,
            maxQualification
        }: {
            phone: string;
            github: string;
            linkedIn: string;
            dateOfBirth: Date;
            age: number;
            address: string;
            bio: string;
            objective: string;
            status: string;
            language: [string];
            gender: string;
            skills: [string];
            maxQualification: string
        } = req.body;
    
        const updateFields: {
            phone: string;
            github: string;
            linkedIn: string;
            dateOfBirth: Date;
            age: number;
            address: string;
            bio: string;
            objective: string;
            status: string;
            language: [string];
            gender: string;
            skills: [string];
            photo?: string;
            maxQualification: string
        } = {
            phone,
            github,
            linkedIn,
            dateOfBirth,
            age,
            address,
            bio,
            objective,
            status,
            language,
            gender,
            skills,
            maxQualification
        };
    
        if (photo) {
            updateFields.photo = photo.path;
        }
    
        try {
            const updatedInfo = await userInfo.findOneAndUpdate({userId}, updateFields, { new: true });
    
            if (!updatedInfo) {
                return res.status(404).json({ msg: "User information not found" });
            }
    
            return res.status(200).json({ msg: "Your information updated successfully", data: updatedInfo });
        } catch (error) {
            next(error);
        }
    },

}

export default userInfoController;