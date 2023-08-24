import express from 'express';
import companyController from '../controller/company/CompanyController';
import userAuth from '../middleware/userAuth';
import companyAuth from '../middleware/companyAuth';
import auth from '../middleware/auth';

const router = express.Router();

router 
.get("/view",[auth, userAuth], companyController.viewCompanies)
.get("/details/:id", [auth, userAuth], companyController.viewCompanyDetails);

export default router;