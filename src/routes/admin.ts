import express from 'express';
const router = express.Router();
import adminController from '../controller/admin/AdminController';
import adminAuth from '../middleware/adminAuth';
import auth from '../middleware/auth';

router.get("/company/view", [auth, adminAuth], adminController.viewCompaniesWithStatus)
.put("/company/approve", [auth, adminAuth], adminController.approveCompany)
.get("/statics/view", adminController.viewAdminStatics);

export default router;

