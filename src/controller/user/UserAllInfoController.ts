import { Response, NextFunction } from "express";
import User from "../../model/User";
import userCareerProfile from "../../model/userCareerProfile";
import userCertification from "../../model/userCertification";
import userEducationDetail from "../../model/userEducationDetail";
import userExprience from "../../model/userExprience";
import userInfo from "../../model/userInfo";
import userProjects from "../../model/userProjects";
import redisClient from "../../utils/redisClient";

const userAllInfoController = {
    async viewUserAllInfo(req: any, res: Response, next: NextFunction) {
        let userId;
        if (req.query.id) {
            userId = req.query.id;
        } else {
            userId = req.user.id;
        }
        const cachekey = `allUserInfo:${userId}`;

        try {
            const allUserInfoCache = await redisClient.get(cachekey);
            if (allUserInfoCache) {
                return res.status(200).json(JSON.parse(allUserInfoCache));
            }
            const user = await User.findById(userId).select("-__v -password -role -approve");
            const carrer = await userCareerProfile.find({ userId }).select("-__v, -_id");
            const certificate = await userCertification.find({ userId }).select("-__v -_id");
            const education = await userEducationDetail.find({ userId }).select("-__v -_id");
            const exprience = await userExprience.find({ userId }).select("-__v -_id");
            const info = await userInfo.findOne({ userId }).select("-__v -_id");
            const project = await userProjects.find({ userId }).select("-__v -_id");

            const userData = {
                name: user?.name,
                email: user?.email,
                phoneNo: user?.phoneNo,
                workStatus: user?.workStatus,
                role: user?.approve,
                info,
                carrer,
                certificate,
                education,
                exprience,
                project
            }
            await redisClient.set(cachekey, JSON.stringify(userData));
            await redisClient.expire(cachekey, 3600);
            return res.status(200).json(userData);
        } catch (error) {
            return next(error);
        }

    }
}

export default userAllInfoController