import express from 'express';
import jobController from '../controller/job/JobController';
import companyAuth from '../middleware/companyAuth';

const router = express.Router();

router 
.post("/add",companyAuth, jobController.postJob)
.get("/view",companyAuth, jobController.viewJobs)
.put("/edit/:id", companyAuth, jobController.editJob)
.delete("/delete/:id", companyAuth, jobController.deleteJob);

export default router;