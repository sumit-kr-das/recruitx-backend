import express from 'express';
import companyController from '../controller/company/CompanyController';
import userAuth from '../middleware/userAuth';
import companyAuth from '../middleware/companyAuth';

const router = express.Router();

router 
.get("/view",userAuth, companyController.viewCompanies)
.get("/details/:id", userAuth, companyController.viewCompanyDetails);

export default router;