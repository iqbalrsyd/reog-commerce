import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as outletController from '../controllers/outlet.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', outletController.createOutlet);
router.get('/my', outletController.getMyOutlets);
router.get('/:id', outletController.getOutletById);
router.put('/:id', authorize('seller', 'admin'), outletController.updateOutlet);
router.delete('/:id', authorize('seller', 'admin'), outletController.deleteOutlet);

export default router;

