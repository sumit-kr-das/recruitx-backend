import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import User from '../../model/User';
import CustomErrorHandler from '../../services/customErrorHandeler';
import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs';
import JwtService from '../../services/jwtServices';
import { MulterService } from '../../services/multerService';

const userController = {
    async viewAllUser(req: any, res: Response, next: NextFunction) {
        try {
            const users = await User.find().select('-password -updatedAt -__v');
            res.status(200).json(users);
        } catch (error) {
            return next(error);
        }
    },

    async viewUser(req: any, res: Response, next: NextFunction) {
        try {
            const user = await User.findOne({ _id: req.user.id }).select(
                '-password -updatedAt -__v'
            );
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            res.status(200).json(user);
        } catch (error) {
            return next(error);
        }
    },

    // async editUser(req: any, res: Response, next: NextFunction) {
    //     MulterService(req, res, async (err) => {
    //         // const {name, email, gender, skills}:{name?:string, email?:string, skills?:[string], gender?:string}= req.body;
    //         if (err) {
    //             return next(CustomErrorHandler.serverError(err.message));
    //         }
    //         let filePath = '';
    //         const data:any = User.findOne({_id:req.user.id});
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

    //             if(data.photo){
    //                 fs.unlink(`http://localhost:3000/${data.photo}`,(error)=>{
    //                     console.log("image deleted");
    //                 });
    //             }
    //         }else{
    //             filePath = data.photo;
    //         }

    //         try {
    //             const update = await User.findByIdAndUpdate({_id:req.user.id},
    //                 {
    //                     name: req.body?.name,
    //                     email: req.body?.emal,
    //                     // password:data.password,
    //                     gender:req.body?.password,
    //                     skills:req.body?.skills,
    //                     photo:filePath
    //                 },
    //                 {new:true}
    //             );

    //             if(update){
    //                 res.status(200).json({msg:"User updated successfully"})
    //             }else{
    //                 res.status(500).json({msg:"There are something wrong"})
    //             }

    //         } catch (error) {
    //             next(error);
    //         }
    //     });
    // },

    async editUser(req: any, res: Response, next: NextFunction) {
        const userSchema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
        })

        const { error } = userSchema.validate(userSchema);
        if (error) {
            next(error);
        }

        const update = await User.findByIdAndUpdate({ _id: req.user.id }, {
            name: req.body?.name,
            email: req.body?.email
        }, {
            new: true
        });

        if (update) {
            res.status(200).json({ msg: "User updated successfully" })
        } else {
            res.status(402).json({ msg: "There are something wrong" })
        }

    }
};

export default userController;
