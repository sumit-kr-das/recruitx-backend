import express from 'express';
import jobController from '../controller/job/JobController';
import companyAuth from '../middleware/companyAuth';
import userAuth from "../middleware/userAuth";
import { jobApplicationController } from '../controller';
import auth from '../middleware/auth';
const router = express.Router();

router 
.post("/add",[auth,companyAuth], jobController.postJob)
.get("/view",[auth,companyAuth], jobController.viewJobs)
.get("/view/feed",[auth, userAuth], jobController.viewJobsFeed)
.put("/edit/:id", [auth,companyAuth], jobController.editJob)
.delete("/delete/:id", [auth,companyAuth], jobController.deleteJob)
.post("/apply/:id", [auth, userAuth], jobApplicationController.jobApply)
.delete("/apply/cancel/:id", [auth, userAuth], jobApplicationController.cancelApply)
.get("/application/view/:id", [auth,companyAuth], jobApplicationController.viewAppliers);

export default router;