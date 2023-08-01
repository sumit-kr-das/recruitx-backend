import express from 'express';
import UserController from '../controller/user/UserController';
import auth from '../middleware/auth';
import userController from '../controller/user/UserController';
import { userCarrerController } from '../controller';

const router = express.Router();

router.get('/view', auth, UserController.viewUser)
      .get("/view/all",auth,userController.viewAllUser)
      .put("/edit", auth, userController.editUser)
      .post("/carrer/add", auth, userCarrerController.addUserCarrer);

export default router;
