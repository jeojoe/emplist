import { Router } from 'express';
import * as ListsController from '../controllers/Lists.controller';
const router = new Router();

// Get all lists
router.route('/lists').get(ListsController.getLists);

// Get one list
/* FOR AUNN !!! Please use /lists/ for consistency amongs api and file's name also */
router.route('/list/:id').get(ListsController.getListDetail);

// Update list (makes new List request)
router.route('/lists/:id').post(ListsController.sendEditListRequest);

// Check if user has permission on the List
router.route('/lists/:id/permission').post(ListsController.checkPermission);

export default router;
