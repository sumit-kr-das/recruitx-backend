import express from 'express';
import UserController from '../controller/user/UserController';
import auth from '../middleware/auth';
import userAuth from '../middleware/userAuth';
import userController from '../controller/user/UserController';
import { userCarrerController, userCertificationController, userEducationController, userExprienceController } from '../controller';

const router = express.Router();

router.get('/view', userAuth, UserController.viewUser)
      .get("/view/all",userAuth,userController.viewAllUser)
      .put("/edit", userAuth, userController.editUser)
      .post("/carrer/add", userAuth, userCarrerController.addUserCarrer)
      .get("/carrer/view", userAuth, userCarrerController.viewUserCarrer)
      .put("/carrer/edit/:id", userAuth, userCarrerController.editUserCarrer)
      .delete("/carrer/delete/:id", userAuth, userCarrerController.deleteUserCarrer)
      .post("/certificate/add", userAuth, userCertificationController.addUserCertificate)
      .get("/certificate/view", userAuth, userCertificationController.viewCerficates)
      .put("/certificate/edit/:id", userAuth, userCertificationController.editCertificate)
      .delete("/certificate/delete/:id", userAuth, userCertificationController.deleteCertificate)
      .post("/education/add", userAuth, userEducationController.addUserEducation)
      .get("/education/view", userAuth, userEducationController.viewUserEducation)
      .put("/education/edit/:id", userAuth, userEducationController.editUserEducation)
      .delete("/education/delete/:id", userAuth, userEducationController.deleteUserEducation)
      .post("/exprience/add", userAuth, userExprienceController.addUserExprience)
      .get("/exprience/view", userAuth, userExprienceController.viewUserExprience)
      .put("/exprience/edit/:id", userAuth, userExprienceController.updateUserExprience)
      .delete("/exprience/delete/:id", userAuth, userExprienceController.deleteUserExperience);

export default router;
