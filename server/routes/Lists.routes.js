import { Router } from 'express';
import * as ListsController from '../controllers/Lists.controller';
const router = new Router();

// Get all Posts
router.route('/lists').get(ListsController.getLists);

// Get one post by cuid
router.route('/list/:id').get(ListsController.getListDetail);

// Delete a post by cuid
// router.route('/posts/:cuid').delete(PostController.deletePost);

export default router;
