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
    .post('/register', registerController.adminRegister);

export default router;
