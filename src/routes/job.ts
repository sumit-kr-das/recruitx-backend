import express from 'express';
import jobController from '../controller/job/JobController';
import companyAuth from '../middleware/companyAuth';
import userAuth from "../middleware/userAuth";
import { jobApplicationController } from '../controller';

const router = express.Router();

router 
.post("/add",companyAuth, jobController.postJob)
.get("/view",companyAuth, jobController.viewJobs)
.get("/view/feed", userAuth, jobController.viewJobsFeed)
.put("/edit/:id", companyAuth, jobController.editJob)
.delete("/delete/:id", companyAuth, jobController.deleteJob)
.post("/apply/:id", userAuth, jobApplicationController.jobApply)
.delete("/apply/cancel/:id", userAuth, jobApplicationController.cancelApply)
.get("/application/view/:id", companyAuth, jobApplicationController.viewAppliers);

export default router;