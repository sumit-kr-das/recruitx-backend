import express from 'express';
import skillController from '../controller/skill/SkillController';

const router = express.Router();

router
    .post('/add', skillController.addSkill)
    .get('/view', skillController.viewSkill);

export default router;
