import { Router } from 'express';
import * as UsersController from '../controllers/Users.controller.js';
const router = new Router();

router.route('/users/login').post(UsersController.login);

export default router;
