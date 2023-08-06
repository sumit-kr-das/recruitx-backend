import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import userExprience from '../../model/userExprience';

const userExprienceController = {
    async addUserExprience(req:any, res:Response, next:NextFunction){
        const userExprienceSchema = Joi.object({
            skills:Joi.array().required(),
            companyName:Joi.string().required(),
            duration:Joi.object({
                startDate:Joi.date().required(),
                endDate:Joi.date()
            }).required(),
            place:Joi.string().required()
        })

        const {error} = userExprienceSchema.validate(req.body);

        if(error){
            next(error);
        }

        const {skills, companyName, duration:{startDate, endDate}, place}:{skills:string, companyName:string, duration:{startDate:Date, endDate:Date}, place:string} = req.body;

        const userExpriences = new userExprience({
            userId:req.user.id,
            skills,
            companyName,
            duration:{
                startDate,
                endDate
            },
            place
        });

        try {
            const addUserExp = await userExpriences.save();
            if(addUserExp){
                return res.status(200).json({msg:"User Exprience Added Successfully"})
            }
        } catch (error) {
            next(error);
        }
    },

    async viewUserExprience(req:any, res:Response, next:NextFunction){
        try {
            const userExpriences = await userExprience.find({userId:req.user.id}).select("-__v -userId -createdAt -updatedAt");
            return res.status(200).json(userExpriences);
        } catch (error) {
            next(error)
        }
    },


}

export default userExprienceController;