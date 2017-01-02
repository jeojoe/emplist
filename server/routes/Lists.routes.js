import { Router } from 'express';
import * as ListsController from '../controllers/Lists.controller';
const router = new Router();

// Get all lists
router.route('/lists').get(ListsController.getLists);

// Get one list
router.route('/list/:id').get(ListsController.getListDetail);

export default router;
