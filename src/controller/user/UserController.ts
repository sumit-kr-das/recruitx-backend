import { NextFunction, Response } from 'express';
import Joi from 'joi';
import User from '../../model/User';
import CustomErrorHandler from '../../services/customErrorHandeler';
import userEducationDetail from '../../model/userEducationDetail';
import userInfo from '../../model/userInfo';

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
                '-_id -password -role -__v',
            );
            if (!user) {
                return next(CustomErrorHandler.notFound());
            }
            res.status(200).json(user);
        } catch (error) {
            return next(error);
        }
    },

    async editUser(req: any, res: Response, next: NextFunction) {
        const userSchema = Joi.object({
            name: Joi.string(),
            email: Joi.string().email(),
            phoneNo: Joi.string(),
            workStatus: Joi.string(),
        });

        const { error } = userSchema.validate(req.body);
        if (error) {
            return next(error);
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: req.user.id },
                {
                    name: req.body?.name,
                    email: req.body?.email,
                    phoneNo: req.body?.phoneNo,
                    workStatus: req.body?.workStatus,
                },
                {
                    new: true,
                },
            );

            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ msg: 'User updated successfully' });
        } catch (err) {
            return next(err);
        }
    },

    async getUserGlobals(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;
        try {
            const user = await User.findById(userId).select("-_id -password -__v -role -approve");
            const education = await userEducationDetail.find({ userId: userId }).select("degree college -_id").sort({ admissionYear: -1 });
            const info = await userInfo.findOne({ userId }).select("photo objective -_id");
            return res.status(200).json({
                user,
                info: {
                    photo: info?.photo || null,
                    objective: info?.objective || null,
                },
                education: {
                    degree: education.length > 0 ? education[0]?.degree : null,
                    college: education.length > 0 ? education[0]?.college : null,
                }
            });
        } catch (error) {
            next(error);
        }
    }

};

export default userController;
