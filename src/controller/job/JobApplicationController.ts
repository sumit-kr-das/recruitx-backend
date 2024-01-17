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
                return res.status(401).json({ msg: "You have already applied in this job" })
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
        const userId = req.params.userId;
        try {
            const deleteApply = await applier.findOneAndDelete({ userId, jobId });
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
            const appliers = await applier.find({ jobId, selected: false }).select("-__v -createdAt -updatedAt").populate("userId");
            return res.status(200).json(appliers)
        } catch (error) {
            return next(error)
        }
    },

    async shortlistApply(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        try {
            const updatedApplier = await applier.findByIdAndUpdate(
                id,
                { selected: true },
                { new: true } // Returns the updated document
            );

            if (!updatedApplier) {
                return res.status(401).json({ error: 'Applier not found' });
            }

            return res.json({ message: 'Application Shortlisted successfully', applier: updatedApplier });
        } catch (error) {
            return next(error);
        }
    },

    async allPostApplicants(req: any, res: Response, next: NextFunction) {
        const jobId = req.params.jobId;
        try {
            const jobs = await job.find({ jobId }).select("info.roles");
            const totalApplication = await applier.countDocuments({ jobId });

            return res.status(200).json({
                post: jobs,
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
    },

    async viewShortListedAppliers(req: Request, res: Response, next: NextFunction) {
        const jobId = req.params.id;
        try {
            const appliers = await applier.find({ jobId, selected: true }).select("-__v -createdAt -updatedAt").populate("userId");
            return res.status(200).json(appliers)
        } catch (error) {
            return next(error)
        }
    },

    async viewAppliedJobs(req: any, res: Response, next: NextFunction) {
        const userId = req.user.id;
        try {
            const jobs = await applier.find({ userId }).select("-userId").populate("jobId");
            return res.status(200).json(jobs);
        } catch (error) {
            return next(error);
        }
    }

}

export default jobApplicationController;