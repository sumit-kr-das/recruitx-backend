import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import CustomErrorHandler from '../../services/customErrorHandeler';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import JwtService from '../../services/jwtServices';
import userCareerProfile from '../../model/userCareerProfile';
import { MulterService } from '../../services/multerService';


const userCarrerController = {
    async addUserCarrer(req:any, res:Response, next:NextFunction){
        const userCarrerSchema = Joi.object({
            industry:Joi.string().required(),
            role:Joi.string().required(),
            jobRole:Joi.string().required(),
            jobType:Joi.string().required(),
            employmentType:Joi.string().required(),
            location:Joi.array().required(),
            expectedSalary:Joi.number().required()
        });

        const {error} = userCarrerSchema.validate(req.body);

        if(error){
            next(error);
        }

        const {industry, role, jobRole, jobType, employmentType, location, expectedSalary}:{industry:string, role:string, jobRole:string, jobType:string, employmentType:string, location:[string], expectedSalary:number} = req.body;

        const userCarrer = new userCareerProfile({
            userId:req.user.id,
            industry,
            role,
            jobRole,
            jobType,
            employmentType,
            location,
            expectedSalary
        });

        try {
            const addCarrer = await userCarrer.save();
            if(addCarrer){
                res.status(200).json({msg:"Carrer Profile updated successfully"});
            }
        } catch (error) {
            next(error);
        }
    },

    
}


export default userCarrerController;