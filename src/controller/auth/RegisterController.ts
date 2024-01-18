import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import { IAdminRequestBody } from '../../@types/adminTypes';
import { ICompanyRequestBody } from '../../@types/companyTypes';
import { IUserRequestBody } from '../../@types/usertypes';
import User from '../../model/User';
import admin from '../../model/admin';
import Company from '../../model/company';
import CustomErrorHandler from '../../services/customErrorHandeler';
import JwtService from '../../services/jwtServices';
import roles from '../../services/roleService';
import otpVerification from '../otpVerificationController';
import otpService from '../../services/otpService';

const registerController = {
    // User Register Controller
    async userRegister(req: Request, res: Response, next: NextFunction) {
        const userRegisterSchema = Joi.object({
            name: Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(
                    new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$'),
                )
                .required(),
            phoneNo: Joi.string().min(10).required(),
            workStatus: Joi.string().required(),
            repeat_password: Joi.ref('password'),
        });

        const { error } = userRegisterSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(
                    CustomErrorHandler.alreadyExist(
                        'This email is already taken !',
                    ),
                );
            }
        } catch (err) {
            return next(err);
        }

        // user not in database register new

        const { name, email, password, phoneNo, workStatus }: IUserRequestBody =
            req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNo,
            workStatus,
            role: 'user',
        });
        let acc_token: any;
        let saveUser;
        try {
            saveUser = await user.save();
            acc_token = JwtService.sign({
                id: saveUser._id,
                role: roles.USER,
            });
        } catch (error) {
            return next(error);
        }

        // sent otp to the user
        otpService({ id: saveUser?._id, email: saveUser?.email }, res, next);

        res.status(200).json({
            status: user.status,
            msg: 'Verification OTP sent on your email',
            data: {
                user: user.name,
                role: user.role,
                access_token: acc_token,
            },
        });
    },

    //Company Register Controller
    async companyRegister(req: Request, res: Response, next: NextFunction) {
        const comapanyRegisterSchema = Joi.object({
            name: Joi.string().min(5).max(40).required(),
            designation: Joi.string().min(3).required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(
                    new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$'),
                )
                .required(),
            repeatPassword: Joi.ref('password'),
            phone: Joi.string().min(10).required(),
            industry: Joi.string().required(),
            companyName: Joi.string().min(3).required(),
            pin: Joi.string().min(6).required(),
            address: Joi.string().required(),
        });

        const { error } = comapanyRegisterSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        //if company name present in the DataBase
        try {
            const exist = await Company.exists({ email: req.body.email });
            if (exist) {
                return next(
                    CustomErrorHandler.alreadyExist(
                        'This Company Email is already Exist!',
                    ),
                );
            }
        } catch (err) {
            return next(err);
        }

        //when company name is not present in the database
        const {
            name,
            description,
            email,
            password,
            industry,
            designation,
            pin,
            repeatPassword,
            address,
            companyName,
            phone,
        }: ICompanyRequestBody = req.body;

        const hashPassword = await bcrypt.hash(password, 10);
        const company = new Company({
            name,
            description,
            email,
            password: hashPassword,
            companyName,
            industry,
            pin,
            phone,
            address,
            designation,
            role: roles.COMPANY,
        });
        try {
            const saveCompany = await company.save();

            const acc_token = JwtService.sign({
                id: saveCompany._id,
                role: roles.COMPANY,
            });

            res.status(200).json({
                access_token: acc_token,
                user: name,
                role: roles.COMPANY,
                status: saveCompany.status,
            });
        } catch (error) {
            return next(error);
        }
    },

    async adminRegister(req: Request, res: Response, next: NextFunction) {
        const adminRegisterSchema = Joi.object({
            name: Joi.string().min(5).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(
                    new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$'),
                )
                .required(),
        });

        const { error } = adminRegisterSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { name, email, password }: IAdminRequestBody = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admins = new admin({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
        });
        let acc_token: any;
        try {
            const saveAdmin = await admins.save();
            //generate access token
            acc_token = JwtService.sign({
                id: saveAdmin._id,
                role: roles.ADMIN,
            });
        } catch (error) {
            return next(error);
        }

        res.status(200).json({
            access_token: acc_token,
            user: admins.name,
            role: admins.role,
        });
    },
};

export default registerController;
