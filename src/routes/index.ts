import express, {Response, Request} from "express"
import skillController from "../controller/skill/SkillController";
import registerController from "../controller/auth/RegisterController";
import loginController from "../controller/auth/LoginController";
import UserController from "../controller/user/UserController";
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
router.get("/user/view",auth, UserController.viewUser);


export default router;