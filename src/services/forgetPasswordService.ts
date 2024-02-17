import { Request, Response, NextFunction } from "express";
import User from "../model/User";
import company from "../model/company";
import admin from "../model/admin";

const forgetPassword = async ({ email, userType }: { email: string, userType: string }, res: Response, next: NextFunction) => {
    try {
        let id;
        if (userType === "1") {
            id = await User.findOne({ email: email }).select("_id");
        } else if (userType === "2") {
            id = await company.findOne({ email: email }).select("_id");
        } else if (userType === "3") {
            id = await admin.findOne({ email: email }).select("_id");
        }
        return id;
    } catch (error) {
        next(error);
    }

}

export default forgetPassword;