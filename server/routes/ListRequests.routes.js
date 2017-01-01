import { Router } from 'express';
import * as ListRequestsController from '../controllers/ListRequests.controller';
const router = new Router();

// Get all list requests
router.route('/requests').get(ListRequestsController.getAllListRequests);

// Check if request exists
router.route('/requests/check/:list_request_id').get(ListRequestsController.checkListRequest);

// Post Request
router.route('/requests').post(ListRequestsController.insertListRequest);

// Make promote request
router.route('/requests/promote/:list_request_id').get(ListRequestsController.requestPromote);

export default router;