import express, {Response, Request} from "express"
import {skillController, registerController, loginController,userController} from "../controller";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/health",(req:Request, res:Response)=>{
    return res.json({msg:"Server is ok"});
});

router.post("/skill/add",skillController.addSkill);
router.get("/skill/view",skillController.viewSkill);

router.post("/user/register",registerController.userRegister);
router.post("/user/login",loginController.userLogin);

//company
router.post("/company/register", registerController.companyRegister);
//router.post("/company/login", loginController.companyLogin);


//user
router.get("/user/view",auth, userController.viewUser);
router.get("/user/view/all",auth, userController.viewAllUser);
router.put("/user/edit", auth, userController.editUser);

export default router;