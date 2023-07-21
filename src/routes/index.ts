import express, {Response, Request} from "express"
import skillController from "../controller/skill/SkillController";
import registerController from "../controller/auth/RegisterController";
import loginController from "../controller/auth/LoginController";

const router = express.Router();

router.get("/health",(req:Request, res:Response)=>{
    return res.json({msg:"Server is ok"});
});

router.post("/skill/add",skillController.addSkill);
router.get("/skill/view",skillController.viewSkill);

router.post("/user/register",registerController.userRegister);
router.post("/user/login",loginController.userLogin);

//company



export default router;