import express from 'express';
import UserController from '../controller/user/UserController';
import auth from '../middleware/auth';
import userController from '../controller/user/UserController';
import { userCarrerController, userCertificationController, userEducationController, userExprienceController } from '../controller';

const router = express.Router();

router.get('/view', auth, UserController.viewUser)
      .get("/view/all",auth,userController.viewAllUser)
      .put("/edit", auth, userController.editUser)
      .post("/carrer/add", auth, userCarrerController.addUserCarrer)
      .get("/carrer/view", auth, userCarrerController.viewUserCarrer)
      .put("/carrer/edit/:id", auth, userCarrerController.editUserCarrer)
      .delete("/carrer/delete/:id", auth, userCarrerController.deleteUserCarrer)
      .post("/certificate/add", auth, userCertificationController.addUserCertificate)
      .get("/certificate/view", auth, userCertificationController.viewCerficates)
      .put("/certificate/edit/:id", auth, userCertificationController.editCertificate)
      .delete("/certificate/delete/:id", auth, userCertificationController.deleteCertificate)
      .post("/education/add", auth, userEducationController.addUserEducation)
      .get("/education/view", auth, userEducationController.viewUserEducation)
      .put("/education/edit/:id", auth, userEducationController.editUserEducation)
      .delete("/education/delete/:id", auth, userEducationController.deleteUserEducation)
      .post("/exprience/add", auth, userExprienceController.addUserExprience)
      .get("/exprience/view", auth, userExprienceController.viewUserExprience);

export default router;
