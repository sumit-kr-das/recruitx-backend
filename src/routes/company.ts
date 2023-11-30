import express from 'express';
import companyController from '../controller/company/CompanyController';
import userAuth from '../middleware/userAuth';
import companyAuth from '../middleware/companyAuth';
import auth from '../middleware/auth';
import { MulterService } from '../services/multerService';
import { loginController, registerController, companyProfileController, statsController } from '../controller';
import ratingController from '../controller/review/RatingController';

const router = express.Router();

router
    .post("/auth/register", registerController.companyRegister)
    .post("/auth/login", loginController.companyLogin)
    .get("/views", companyController.viewCompanies)
    .put("/edit", [auth, companyAuth], companyController.editCompany)
    .get("/view", [auth, companyAuth], companyController.viewCompany)
    .get("/details", [auth, companyAuth], companyController.viewCompanyDetails)
    .post("/rating/add", [auth, userAuth], ratingController.addRating)
    .get("/rating/view/:companyId", [auth], ratingController.viewRatings)
    .put("/rating/edit/:id", [auth, userAuth], ratingController.editRating)
    .get("/profile/view", [auth, companyAuth], companyProfileController.viewProfile)
    .post("/profile/add", MulterService, [auth, companyAuth], companyProfileController.addProfile)
    .put("/profile/edit", MulterService, [auth, companyAuth], companyProfileController.editProfile)
    .get("/info/all/view", [auth], companyProfileController.viewComapnyAllInfo)
    // .put("/edit", [auth, companyAuth], companyController.editCompany)
    .put("/password/change", [auth, companyAuth], companyController.changePassword)
    .delete("/delete", [auth, companyAuth], companyController.deleteCompany)
    .get("/stats", [auth, companyAuth], statsController.companyStats);

export default router;