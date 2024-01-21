import express from 'express';
import jobController from '../controller/job/JobController';
import companyAuth from '../middleware/companyAuth';
import userAuth from "../middleware/userAuth";
import { jobApplicationController, searchJobController, jobRecomandationController } from '../controller';
import auth from '../middleware/auth';
const router = express.Router();

router
    .post("/add", [auth, companyAuth], jobController.postJob)
    .get("/view", [auth, companyAuth], jobController.viewJobs)
    .get("/view/feed", jobController.viewJobsFeed)
    .put("/edit/:id", [auth, companyAuth], jobController.editJob)
    .delete("/delete/:id", [auth, companyAuth], jobController.deleteJob)
    .post("/apply/:id", [auth, userAuth], jobApplicationController.jobApply)
    .delete("/apply/cancel/:id/:userId", [auth, companyAuth], jobApplicationController.cancelApply)
    .put("/apply/approve/:id", [auth, companyAuth], jobApplicationController.shortlistApply)
    .get("/apply/shortlisted/view/:id", [auth, companyAuth], jobApplicationController.viewShortListedAppliers)
    .get("/application/view/:id", [auth, companyAuth], jobApplicationController.viewAppliers)
    .post("/search", searchJobController.searchJob)
    .get("/search/tag", searchJobController.searchByTags)
    .get("/search/skill", searchJobController.searchBySkill)
    .put("/deactive/:jobId", [auth, companyAuth], jobController.deactivateJob)
    .get("/recommandtions", [auth, userAuth], jobRecomandationController.recommendJobs)
    .get("/roles/totalapplication/:jobId", [auth, companyAuth], jobApplicationController.allPostApplicants)
    .get("/applications/manage/:jobId", [auth, companyAuth], jobApplicationController.allManageApplicants)
    .get("/statics", [auth, companyAuth], jobController.getJobStatics)
    .get("/details/:jobId", jobController.getJobDetails);
export default router;