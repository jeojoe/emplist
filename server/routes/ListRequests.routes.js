import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../secret_config.json';
import * as ListRequestsController from '../controllers/ListRequests.controller';
const router = new Router();

// Authenticated-API Middleware
// All these APIs expect to receive 'token' either from body or query, which is retrieved upon admin's login.
router.use((req, res, next) => {
  const token = req.body.token || req.query.token;
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.status(500).json({
          ok: false,
          msg: err,
        });
        throw err;
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({
      ok: false,
      msg: 'No token provided',
    });
  }
});

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
