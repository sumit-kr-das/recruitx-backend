import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import company from "../model/company";
import admin from "../model/admin";

const forgetPassword = async ({ email, userType }: { email: string, userType: string }, res: Response, next: NextFunction) => {
    try {
        let id;
        if (userType === "user") {
            id = await User.findOne({ email: email }).select("_id");
        } else if (userType === "company") {
            id = await company.findOne({ email: email }).select("_id");
        } else if (userType === "admin") {
            id = await admin.findOne({ email: email }).select("_id");
        }
        return id;
    } catch (error) {
        next(error);
    }

}

export default forgetPassword;