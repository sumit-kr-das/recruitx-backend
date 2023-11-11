import express from 'express';
import companyController from '../controller/company/CompanyController';
import userAuth from '../middleware/userAuth';
import companyAuth from '../middleware/companyAuth';
import auth from '../middleware/auth';
import { MulterService } from '../services/multerService';
import { loginController, registerController } from '../controller';

const router = express.Router();

router 
.post("/auth/register", registerController.companyRegister)
.post("/auth/login", loginController.companyLogin)
.get("/view",[auth, userAuth], companyController.viewCompanies)
.get("/details/:id", [auth, userAuth], companyController.viewCompanyDetails);

export default router;