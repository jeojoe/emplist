import { Router } from 'express';
import * as UsersController from '../controllers/Users.controller.js';
const router = new Router();

// Validate token
router.route('/users/token').get(UsersController.validateToken);

// User login
router.route('/users/login').post(UsersController.login);

export default router;
