import { Router } from 'express';
import * as UsersController from '../controllers/Users.controller.js';
const router = new Router();

// Validate editing token
router.route('/users/permission/edit/:list_id').get(UsersController.validateEditingToken);

// Validate admin token
router.route('/users/permission/admin').get(UsersController.validateAdminToken);

// User login
router.route('/users/login').post(UsersController.login);

export default router;
