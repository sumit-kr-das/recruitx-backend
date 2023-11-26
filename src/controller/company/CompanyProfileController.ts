import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import companyProfile from "../../model/companyProfile";

const companyProfileController = {
    async addProfile(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;


        const verifyProfile = Joi.object({
            description: Joi.string().min(15).required(),
            teamSize: Joi.number().required(),
            type: Joi.string().required(),
            tags:Joi.array().required(),
            founded:Joi.string().required()
        });

        const { error } = verifyProfile.validate(req.body);

        if (error) {
            next(error);
        }

        let logo;


        if (!req.file) {
           logo="";
        }else{
            logo = req.file.path;
        }


        const { description, teamSize, type, tags, founded }: { description: string, teamSize: number, type: string, tags:[string], founded:string } = req.body;

        const profile = new companyProfile({
            companyId,
            description,
            logo,
            teamSize,
            type,
            tags,
            founded
        });

        try {
            const saveProfile = await profile.save();
            return res.status(200).json({ msg: "profile added" });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async editProfile(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;

        const verifyProfile = Joi.object({
            description: Joi.string().min(15),
            teamSize: Joi.number(),
            type: Joi.string(),
            tags: Joi.array(),
            founded: Joi.string()
        });

        const { error } = verifyProfile.validate(req.body);

        if (error) {
            next(error);
        }


        const { description, teamSize, type, tags, founded }: { description?: string; teamSize?: number; type?: string, tags?:[string], founded?:string  } = req.body;

        const oldProfile = await companyProfile.findOne({ companyId });

        if (!oldProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        let logo;

        if(req.file){
            logo = req.file.path;
        }else{
            logo = oldProfile?.logo;
        }


        const profile = {
            companyId,
            description: description || oldProfile.description,
            teamSize: teamSize || oldProfile.teamSize,
            type: type || oldProfile.type,
            tags: tags || oldProfile.tags,
            founded: founded || oldProfile.founded,
            logo: logo 
        }

        try {
            const updatedProfile = await companyProfile.findOneAndUpdate({companyId}, profile, { returnOriginal: false });
            return res.status(200).json({ message: "Profile updated" });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },

    async viewProfile(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        console.log(companyId);
        // const profileId = req.params.id;
      
        try {
          const profile = await companyProfile.findOne({ companyId }).select("-_id -companyId");
          if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
          }
      
          return res.status(200).json(profile);
        } catch (error) {
          next(error);
        }
      }
}

export default companyProfileController;