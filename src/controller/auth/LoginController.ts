import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import User from '../../model/User';
import admin from '../../model/admin';
import company from '../../model/company';
import CustomErrorHandler from '../../services/customErrorHandeler';
import JwtService from '../../services/jwtServices';
import roles from '../../services/roleService';
import { ILogin } from '../../@types/loginTypes';
import userInfo from '../../model/userInfo';
import userEducationDetail from '../../model/userEducationDetail';

const loginController = {
    async userLogin(req: Request, res: Response, next: NextFunction) {
        const userLoginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(
                    new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$'),
                )
                .required(),
        });

        const { error } = userLoginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { email, password }: ILogin = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const matchPassword = await bcrypt.compare(password, user.password);
            if (!matchPassword) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const info = await userInfo
                .findOne({ userId: user._id })
                .select('-_id photo objective');
            const education = await userEducationDetail
                .find({ userId: user.id })
                .select('-_id degree college');

            /* compare access token */
            const access_token = JwtService.sign({
                id: user._id,
                role: roles.USER,
            });

            res.status(200).json({
                status: user.status,
                data: {
                    user: user.name,
                    role: user.role,
                    access_token: access_token,
                },
            });
        } catch (error) {
            return next(error);
        }
    },

    async companyLogin(req: any, res: Response, next: NextFunction) {
        const companyLoginSchema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string()
                .pattern(
                    new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$'),
                )
                .required(),
        });

        const { error } = companyLoginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { email, password }: ILogin = req.body;

        try {
            const companyInfo = await company.findOne({ email });
            if (!companyInfo) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const matchPassword = await bcrypt.compare(
                password,
                companyInfo.password,
            );
            if (!matchPassword) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const access_token = JwtService.sign({
                id: companyInfo._id,
                role: roles.COMPANY,
            });

            return res.status(200).json({
                status: companyInfo.status,
                data: {
                    user: companyInfo.name,
                    role: companyInfo.role,
                    access_token: access_token,
                },
            });
        } catch (error) {
            return next(error);
        }
    },

    async adminLogin(req: Request, res: Response, next: NextFunction) {
        const adminLoginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string()
                .pattern(
                    new RegExp('^[a-zA-Z0-9!@#$%^&*()_+{}|:"<>?~-]{3,30}$'),
                )
                .required(),
        });

        const { error } = adminLoginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { email, password }: ILogin = req.body;

        try {
            const admins = await admin.findOne({ email });
            if (!admins) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            const matchPassword = await bcrypt.compare(
                password,
                admins.password,
            );
            if (!matchPassword) {
                return next(CustomErrorHandler.wrongCredentials());
            }

            /* compare access token */
            const access_token = JwtService.sign({
                id: admins._id,
                role: roles.ADMIN,
            });
            res.status(200).json({
                status: admins.status,
                data: {
                    user: admins.name,
                    role: admins.role,
                    access_token: access_token,
                },
            });
        } catch (error) {
            next(error);
        }
    },
};

export default loginController;
