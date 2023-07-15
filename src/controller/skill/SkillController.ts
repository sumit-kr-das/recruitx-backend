import { Response, Request, NextFunction } from "express";
import CustomErrorHandler from "../../services/customErrorHandeler";
import Skill from "../../model/skill";

const skillController = {
    async addSkill(req:Request, res:Response, next:NextFunction){
        const {name}:{name:string} = req.body;
        try {
            const hasSkill = await Skill.exists({name});
            if(hasSkill){
                return next(CustomErrorHandler.alreadyExist("Skill is already added"));
            }
        } catch (error) {
            console.log(error);
        }

        const newSkill = new Skill({
            name
        });

        try {
            const submit = await newSkill.save();
            if(submit){
                return res.status(200).json({msg:"Skills added successfully"});
            }
        } catch (error) {
            console.log(error);
        }

    },

    async viewSkill(req:Request, res:Response, next:NextFunction){
        try {
            const skills = (await Skill.find().select("-updatedAt -__v").sort({"createdAt":-1}));
            return res.status(200).json(skills);
        } catch (error) {
            console.log(error);
        }
    }
}

export default skillController;