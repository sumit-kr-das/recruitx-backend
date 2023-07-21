import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import User from "../../model/User";
import CustomErrorHandler from '../../services/customErrorHandeler';
import bcrypt from 'bcrypt';
import JwtService from '../../services/jwtServices';

const registerController = {
    async userRegister(req:Request, res:Response, next:NextFunction){
        const userRegisterSchema = Joi.object({
            name: Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$')).required(),
            repeat_password: Joi.ref('password'),
            gender:Joi.string().min(4).required(),
            skills:Joi.array().min(1).required(),
            photo:Joi.string(),
        });

        const {error} = userRegisterSchema.validate(req.body);

        if(error){
            next(error);
        }

        //if user in already in database
        try{
            const exist = await User.exists({ email: req.body.email });
            if(exist){
                return next(CustomErrorHandler.alreadyExist("This email is already taken !"));
            }
        }catch(err){
            next(err);
        }

        //user not in database register new

        const {name, email, password, repeat_password, gender, skills, photo}:{name:string, email:string, password:string, repeat_password:string,skills:[string], gender:string, photo:string}= req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password:hashedPassword,
            gender,
            skills,
            photo,
        });
        let acc_token:any;
        try {
            const saveUser = await user.save();
            //generate access token
            acc_token = JwtService.sign({
                _id: saveUser._id,
                role:"user"
            });
        } catch (error) {
            next(error);
        }

        res.status(200).json({acc_token:acc_token});
    },
}

export default registerController;