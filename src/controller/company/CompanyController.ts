import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import company from '../../model/company';
import redisClient from '../../utils/redisClient';

const companyController = {
    async viewCompanies(req: Request, res: Response, next: NextFunction) {
        const { limit, ...others }: { limit?: number;[key: string]: any } =
            req.query;

        try {
            if (limit) {
                const cacheKey = JSON.stringify({ ...others, limit });
                console.log(cacheKey);
                const hasCompany = await redisClient.get(cacheKey);

                if (hasCompany) {
                    return res.status(200).json(JSON.parse(hasCompany));
                }
                const companies = await company
                    .find({ ...others, approve: true }).populate("companyProfileId", "logo")
                    .limit(limit)
                    .sort({ rating: 1 })
                    .select('-__v -password -createdAt -updatedAt -status -role -approve');
                // await redisClient.set(cacheKey, JSON.stringify(companies));
                // await redisClient.expire(cacheKey, 3600);
                return res.status(200).json(companies);
            } else {
                const companies = await company
                    .find({ ...others }).populate("companyProfileId", "logo")
                    .sort({ rating: 1 })
                    .select('-__v -password -createdAt -updatedAt -status -role -approve');
                return res.status(200).json(companies);
            }
        } catch (error) {
            return next(error);
        }
    },

    async viewCompany(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;

        try {
            const companyDetail = await company
                .findOne({ _id: companyId }).populate("companyProfileId", "logo")
                .select('-__v');
            return res.status(200).json(companyDetail);
        } catch (error) {
            return next(error);
        }
    },

    async viewCompanyDetails(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        try {
            const companyDetail = await company
                .findOne({ _id: companyId }).populate("companyProfileId")
                .select('-__v -updatedAt');
            return res.status(200).json(companyDetail);
        } catch (error) {
            return next(error);
        }
    },

    async editCompany(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;

        const companySchema = Joi.object({
            name: Joi.string(),
            email: Joi.string(),
            phone: Joi.string().min(10),
            companyName: Joi.string(),
            industry: Joi.string(),
            designation: Joi.string(),
            pin: Joi.string(),
            address: Joi.string(),
        });

        const { error } = companySchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {
            name,
            email,
            phone,
            companyName,
            industry,
            designation,
            pin,
            address,
        }: {
            name?: string;
            email?: string;
            phone?: string;
            companyName?: string;
            industry?: string;
            designation?: string;
            pin?: string;
            address?: string;
        } = req.body;

        const oldCompany = await company.findById(companyId);

        if (!oldCompany) {
            return res.status(404).json({ msg: 'No company found' });
        }

        const updateData = {
            name: name || oldCompany.name,
            email: email || oldCompany.email,
            phone: phone || oldCompany.phone,
            companyName: companyName || oldCompany.companyName,
            designation: designation || oldCompany.designation,
            pin: pin || oldCompany.pin,
            address: address || oldCompany.address,
        };

        try {
            const updateCompany = await company.findOneAndUpdate(
                { _id: companyId },
                updateData,
                { returnOriginal: false },
            );
            return res
                .status(200)
                .json({ msg: 'Company updated successfully' });
        } catch (error) {
            return next(error);
        }
    },

    async changePassword(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        const passwordSchema = Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
        });

        const { error } = passwordSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const {
            oldPassword,
            newPassword,
        }: { oldPassword: string; newPassword: string } = req.body;

        try {
            const companyData = await company
                .findById(companyId)
                .select('password');

            if (!companyData) {
                return res.status(404).json({ msg: 'company not found' });
            }

            const matchPassword = await bcrypt.compare(
                oldPassword,
                companyData.password,
            );
            if (!matchPassword) {
                return res
                    .status(404)
                    .json({ msg: 'Your credentials are invalid' });
            } else {
                try {
                    const hashedPassword = await bcrypt.hash(newPassword, 10);

                    const updateCompany = await company.findOneAndUpdate(
                        { _id: companyId },
                        { password: hashedPassword },
                        { returnOriginal: false },
                    );
                    return res.status(200).json({ msg: 'Password updated' });
                } catch (error) {
                    next(error);
                }
            }
        } catch (error) {
            return next(error);
        }
    },

    async deleteCompany(req: any, res: Response, next: NextFunction) {
        const companyId = req.user.id;
        const deleteSchema = Joi.object({
            password: Joi.string().required(),
        });

        const { error } = deleteSchema.validate(req.body);
        if (error) {
            return next(error);
        }

        const { password }: { password: string } = req.body;

        try {
            const companyData = await company
                .findById(companyId)
                .select('password');

            if (!companyData) {
                return res.status(404).json({ msg: 'company not found' });
            }

            const matchPassword = await bcrypt.compare(
                password,
                companyData.password,
            );

            if (matchPassword) {
                const deleteCompany = await company.findOneAndDelete({
                    _id: companyId,
                });

                if (!deleteCompany) {
                    return res.status(404).json({ msg: 'Company not found' });
                }

                return res
                    .status(200)
                    .json({ msg: 'Company Deleted Successfully' });
            } else {
                return res.status(404).json({ msg: 'Invalid credentials' });
            }
        } catch (error) {
            return next(error);
        }
    },
};

export default companyController;
