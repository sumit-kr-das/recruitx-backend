import express from 'express';
import UserController from '../controller/user/UserController';
import auth from '../middleware/auth';
import userAuth from '../middleware/userAuth';
import userController from '../controller/user/UserController';
import { projectController, userCarrerController, userCertificationController, userEducationController, userExprienceController, userInfoController, userAllInfoController, statsController, jobApplicationController } from '../controller';
import { MulterService } from '../services/multerService';
import companyAuth from '../middleware/companyAuth';
import userRecomandation from '../controller/user/UserRecomandation';
import adminAuth from '../middleware/adminAuth';

const router = express.Router();

router.get('/view', [auth, userAuth], UserController.viewUser)
      .get("/view/all", [auth, adminAuth], userController.viewAllUser)
      .put("/edit", [auth, userAuth], userController.editUser)
      .post("/carrer/add", [auth, userAuth], userCarrerController.addUserCarrer)
      .get("/carrer/view", [auth, userAuth], userCarrerController.viewUserCarrer)
      .put("/carrer/edit/:id", [auth, userAuth], userCarrerController.editUserCarrer)
      .delete("/carrer/delete/:id", [auth, userAuth], userCarrerController.deleteUserCarrer)
      .post("/certificate/add", [auth, userAuth], userCertificationController.addUserCertificate)
      .get("/certificate/view", [auth, userAuth], userCertificationController.viewCerficates)
      .put("/certificate/edit/:id", [auth, userAuth], userCertificationController.editCertificate)
      .delete("/certificate/delete/:id", [auth, userAuth], userCertificationController.deleteCertificate)
      .post("/education/add", [auth, userAuth], userEducationController.addUserEducation)
      .get("/education/view", [auth, userAuth], userEducationController.viewUserEducation)
      .put("/education/edit/:id", [auth, userAuth], userEducationController.editUserEducation)
      .delete("/education/delete/:id", [auth, userAuth], userEducationController.deleteUserEducation)
      .post("/exprience/add", [auth, userAuth], userExprienceController.addUserExprience)
      .get("/exprience/view", [auth, userAuth], userExprienceController.viewUserExprience)
      .put("/exprience/edit/:id", [auth, userAuth], userExprienceController.updateUserExprience)
      .delete("/exprience/delete/:id", [auth, userAuth], userExprienceController.deleteUserExperience)
      .post("/info/add", MulterService, [auth, userAuth], userInfoController.addUseInfo)
      .get("/info/view", [auth, userAuth], userInfoController.viewUserinfo)
      .put("/info/update", MulterService, [auth, userAuth], userInfoController.updateUserinfo)
      .get("/search", [auth, companyAuth], userRecomandation.userRecomand)

      .post("/project/add", [auth, userAuth], projectController.createProject)
      .get("/project/view", [auth, userAuth], projectController.viewProject)
      .put("/project/update/:id", [auth, userAuth], projectController.updateProject)
      .delete("/project/delete/:id", [auth, userAuth], projectController.deleteProject)

      .get("/all/info/view", [auth, userAuth], userAllInfoController.viewUserAllInfo)
      .get("/stats", statsController.viewStats)
      .get("/applied/jobs/view", [auth, userAuth], jobApplicationController.viewAppliedJobs);

export default router;
