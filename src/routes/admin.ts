import express from 'express';
const router = express.Router();
import adminController from '../controller/admin/AdminController';
import adminAuth from '../middleware/adminAuth';
import auth from '../middleware/auth';
import { loginController, registerController } from '../controller';

router
    .get(
        '/company/view',
        [auth, adminAuth],
        adminController.viewCompaniesWithStatus,
    )
    .put(
        '/company/approve/:companyId',
        [auth, adminAuth],
        adminController.approveCompany,
    )
    .get('/view', [auth, adminAuth], adminController.viewAdmin)
    .get('/statics/view', [auth, adminAuth], adminController.viewAdminStatics)
    .post('/login', loginController.adminLogin)
    .post('/register', registerController.adminRegister)
    .put("/restrict/company/:companyId", [auth, adminAuth], adminController.restrictCompany)
    .put("/restrict/user/:userId", [auth, adminAuth], adminController.restrictUser)
    .get("/user/restrict/view", [auth, adminAuth], adminController.viewRestrictUsers)
    .put("/user/unrestrict/:userId", [auth, adminAuth], adminController.unRestrictUser)
    .put("/password/change", [auth, adminAuth], adminController.changePassword);

export default router;
