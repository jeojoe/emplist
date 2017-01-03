import { Router } from 'express';
import * as ListRequestsController from '../controllers/ListRequests.controller';
const router = new Router();

// Get all list requests
router.route('/requests').get(ListRequestsController.getAllListRequests);

// Get one List request
router.route('/requests/:list_request_id').get(ListRequestsController.getListRequest);

// Check if request exists
router.route('/requests/check/:list_request_id').get(ListRequestsController.checkListRequest);

// Approve new List request
router.route('/requests/approve/new/:list_request_id').put(ListRequestsController.approveNewListRequest);

// Approve edit List request
router.route('/requests/approve/edit/:list_request_id').put(ListRequestsController.approveEditListRequest);

// Post Request
router.route('/requests').post(ListRequestsController.insertListRequest);

// Make promote request
router.route('/requests/promote/:list_request_id').get(ListRequestsController.requestPromote);

export default router;
