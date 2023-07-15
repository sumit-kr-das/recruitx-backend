import express, {Response, Request} from "express"
import skillController from "../controller/skill/SkillController";

const router = express.Router();

router.get("/health",(req:Request, res:Response)=>{
    return res.json({msg:"Server is ok"});
});

router.post("/skill/add",skillController.addSkill);
router.get("/skill/view",skillController.viewSkill);

export default router;