import { Router } from 'express';
import * as CompaniesController from '../controllers/Companies.controller';
const router = new Router();

// Get all companies
router.route('/companies').get(CompaniesController.getCompanies);

export default router;
