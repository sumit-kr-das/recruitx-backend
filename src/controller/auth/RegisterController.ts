import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import path from 'path';
import User from "../../model/User";
import Company from "../../model/company";
import CustomErrorHandler from '../../services/customErrorHandeler';
import bcrypt from 'bcrypt';
import JwtService from '../../services/jwtServices';
import { MulterService } from '../../services/multerService';

const registerController = {
  //User Register Controller

  async userRegister(req:Request, res:Response, next:NextFunction){
    MulterService(req, res, async(err:any)=>{
      const userRegisterSchema = Joi.object({
        name: Joi.string().min(5).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$')).required(),
        repeat_password: Joi.ref('password'),
        gender:Joi.string().min(4).required(),
        skills:Joi.array().min(1).required(),
        // photo:Joi.any()
    });

    const {error} = userRegisterSchema.validate(req.body);

    if(error){
        next(error);
    }

      if(err){
        return next(CustomErrorHandler.serverError(err.message));
      }
      let filePath = '';
      if(req.file){
        filePath= req.file.path;
        const fileExtension = path.extname(filePath);
        if(fileExtension!=='.jpg' && fileExtension!=='.png' && fileExtension!=='.jpeg'){
          return res.status(401).json({msg:"File type is not valid"});
        }
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

    // user not in database register new

    const {name, email, password, repeat_password, gender, skills}:{name:string, email:string, password:string, repeat_password:string,skills:[string], gender:string}= req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password:hashedPassword,
        gender,
        skills,
        photo:filePath,
    });
    let acc_token:any;
    try {
        const saveUser = await user.save();
        //generate access token
        acc_token = JwtService.sign({
            id: saveUser._id,
            role:"user"
        });
    } catch (error) {
        next(error);
    }

    res.status(200).json({acc_token:acc_token});
    })
  },



  // //Company Register Controller


  async companyRegister(req: Request , res: Response ,  next: NextFunction){
      const comapanyRegisterSchema = Joi.object({
        name: Joi.string().min(5).max(40).required(),
        designation: Joi.string().min(10).required(),
        email:Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$')).required(),
        repeatPassword: Joi.ref('password'),
        phone:Joi.string().min(10).required(),
        industry: Joi.string().required(),
        companyName: Joi.string().required(),
        pin:Joi.string().required(),
        address: Joi.string().required(),
        
      });

      console.log(req.body);

      const {error} = comapanyRegisterSchema.validate(req.body);

      if(error){
        next(error);
      }

      //if company name present in the DataBase
      try{
        const exist = await Company.exists({email: req.body.email});
        if(exist) {
          return next(CustomErrorHandler.alreadyExist("This Company Email is already Exist!"));
        }
      }catch(err){
        next(err);
      }

      //when company name is not present in the database
      const {name , description , email , password , industry, designation, pin, address, companyName, phone}: {name: string , description: string, email: string , password: string , repeatPassword: string , industry:string, designation:string, pin:string, address:string, companyName:string, phone:string} = req.body;

      const hashPassword = await bcrypt.hash(password , 10);
      const company = new Company({
        name,
        description,
        email,
        password : hashPassword,
        companyName,
        industry,
        pin,
        phone,
        address,
        designation,
        role:"company"
      });
      let acc_token:any;
      try{
        const saveCompany = await company.save();

        acc_token = JwtService.sign({
          id: saveCompany._id,
          role : "company"
        });
      } catch(error){
        next(error);
      }

      res.status(200).json({acc_token: acc_token});
    },

  // async register(req: Request, res: Response, next: NextFunction) {
  //   const registerSchema = Joi.object({
  //     name: Joi.string().required(),
  //     email: Joi.string().required(),
  //     password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$')).required(),
  //     role: Joi.string().required()
  //   });

  //   const { error } = registerSchema.validate(req.body);
  //   if (error) {
  //     next(error);
  //   }
  //   const { name, email, password, role }: { name: string, email: string, password: string, role: string } = req.body;

  //   try {
  //     const exist = await User.exists({ email: req.body.email });
  //     if (exist) {
  //       return next(CustomErrorHandler.alreadyExist("User is already Exist!"));
  //     }
  //   } catch (err) {
  //     next(err);
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);


  //   const user = new User({
  //     name,
  //     email,
  //     password: hashedPassword,
  //     role
  //   });

  //   let acc_token:any;

  //   try {
  //     const saveuser = await user.save();
  //     acc_token = JwtService.sign({
  //       id: saveuser.id,
  //       role: saveuser.role
  //     });
  //     res.status(200).json({acc_token: acc_token});
  //   } catch (error) {
  //     next(error);
  //   }

  // }
}

export default registerController;