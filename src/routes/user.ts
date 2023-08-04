import express from 'express';
import UserController from '../controller/user/UserController';
import auth from '../middleware/auth';
import userController from '../controller/user/UserController';
import { userCarrerController } from '../controller';

const router = express.Router();

router.get('/view', auth, UserController.viewUser)
      .get("/view/all",auth,userController.viewAllUser)
      .put("/edit", auth, userController.editUser)
      .post("/carrer/add", auth, userCarrerController.addUserCarrer)
      .get("/carrer/view", auth, userCarrerController.viewUserCarrer)
      .put("/carrer/edit", auth, userCarrerController.editUserCarrer)
      .delete("/carrer/delete", auth, userCarrerController.deleteUserCarrer);

export default router;
