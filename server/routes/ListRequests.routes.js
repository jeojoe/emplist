import { Router } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../secret_config.json';
import * as ListRequestsController from '../controllers/ListRequests.controller';

const router = new Router();

// Post Request
router.route('/requests').post(ListRequestsController.insertListRequest);

// Check if request exists
router.route('/requests/check/:list_request_id').get(ListRequestsController.checkListRequest);

// Make promote request - Legacy
// router.route('/requests/promote/:list_request_id').get(ListRequestsController.requestPromote);

// Authenticated-API Middleware
// All APIs below this line are expected to receive 'token' either from body or query, which is retrieved upon admin's login.
router.use((req, res, next) => {
  const token = req.body.token || req.query.token;
  if (token) {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        res.json({
          ok: false,
          msg: `Token fuck up ${err}`,
          err,
        });
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

// For Admin - Get all list requests
router.route('/requests').get(ListRequestsController.getAllListRequests);

// For Admin - Get one List request
router.route('/requests/:list_request_id').get(ListRequestsController.getListRequest);

// For Admin - Approve new List request
router.route('/requests/approve/new/:list_request_id').put(ListRequestsController.approveNewListRequest);

// For Admin - Approve edit List request
router.route('/requests/approve/edit/:list_request_id').put(ListRequestsController.approveEditListRequest);

export default router;
