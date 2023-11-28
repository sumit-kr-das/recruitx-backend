import { Response, Request, NextFunction } from "express";
import Joi from "joi";
import applier from "../../model/applier";
import job from "../../model/job";

const jobApplicationController = {
    async jobApply(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.id;

        try {
            const application = await applier.findOne({ jobId, userId: req.user.id });
            if (application) {
                return res.status(200).json({ msg: "user already applied" })
            }
        } catch (error) {
            return next(error)
        }
        const newApply = new applier({
            jobId,
            userId: req.user.id,
            selected: false
        })

        try {
            const apply = await newApply.save();
            if (!apply) {
                return res.status(402).json({ msg: "Job not found" })
            }
            return res.status(200).json({ msg: "Application submitted successfully" })
        } catch (error) {
            return next(error);
        }
    },

    async cancelApply(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.id;
        try {
            const deleteApply = await applier.findOneAndDelete({ userId: req.user.id, jobId });
            if (!deleteApply) {
                return res.status(402).json({ msg: "Application not found" })
            }
            return res.status(200).json({ msg: "Your Application Canceled Successfully" })
        } catch (error) {
            return next(error);
        }
    },

    async viewAppliers(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.id;
        try {
            const appliers = await applier.find({ jobId }).select("-__v -createdAt -updatedAt -_id");
            return res.status(200).json(appliers)
        } catch (error) {
            return next(error)
        }
    },

    async allPostApplicants(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.jobId;
        try {
            const jobs = await job.findById(jobId).select("info.roles");
            const totalApplication = await applier.countDocuments({ jobId });

            return res.status(200).json({
                post: jobs?.info.roles,
                totalApplicants: totalApplication
            })
        } catch (error) {
            return next(error);
        }
    },

    async allManageApplicants(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.jobId;
        try {
            const all = await applier.countDocuments({ jobId });
            const approved = await applier.countDocuments({ jobId, selected: true });
            const rejected = await applier.countDocuments({ jobId, selected: false });
            return res.status(200).json({
                all,
                approved,
                rejected
            })
        } catch (error) {
            return next(error);
        }
    }

}

export default jobApplicationController;