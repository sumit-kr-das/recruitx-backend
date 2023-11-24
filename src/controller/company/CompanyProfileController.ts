import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import companyProfile from "../../model/companyProfile";

const companyProfileController = {
    async addProfile(req: any, res: Response, next: NextFunction) {
        console.log(req.body);
        const companyId = req.user.id;

        const verifyProfile = Joi.object({
            description: Joi.string().min(15).required(),
            teamSize: Joi.number().required(),
            type: Joi.string().required(),
        });

        const { error } = verifyProfile.validate(req.body);

        if (error) {
            console.log(error);
            next(error);
        }

        console.log(req.file);

        if (!req.file) {
            return res.status(503).json({ message: "please enter logo" });
        }

        const logo = req.file;

        const { description, teamSize, type }: { description: string, teamSize: number, type: string } = req.body;

        const profile = new companyProfile({
            companyId,
            description,
            logo: logo?.path,
            teamSize,
            type
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
        const profileId = req.params.id;

        const verifyProfile = Joi.object({
            description: Joi.string().min(15).required(),
            teamSize: Joi.number().required(),
            type: Joi.string().required(),
        });

        const { error } = verifyProfile.validate(req.body);

        if (error) {
            next(error);
        }

        const logo = req.file;

        let { description, teamSize, type }: { description: string; teamSize: number; type: string } = req.body;

        const oldProfile = await companyProfile.findOne({ companyId, _id: profileId });

        if (!oldProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        let profile ={};

        if (logo) {
            description = description || oldProfile.description;
            teamSize = teamSize || oldProfile.teamSize;
            type = type || oldProfile.type;

             profile = {
                companyId,
                description,
                logo: logo?.path,
                teamSize,
                type,
            };
        } else {
             profile = {
                companyId,
                description,
                teamSize,
                type,
            };
        }

        try {
            const updatedProfile = await companyProfile.findByIdAndUpdate(profileId, profile, { returnOriginal: false });
            return res.status(200).json({ message: "Profile updated" });
        } catch (error) {
            next(error);
        }
    },

    async viewProfile(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        console.log(companyId);
        // const profileId = req.params.id;
      
        try {
          const profile = await companyProfile.findOne({ companyId });
          if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
          }
      
          return res.status(200).json({ profile });
        } catch (error) {
          next(error);
        }
      }
}

export default companyProfileController;