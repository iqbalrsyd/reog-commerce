import express from 'express';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { upload, handleUploadError } from '../utils/upload.js';
import * as productController from '../controllers/product.controller.js';

const router = express.Router();

// Public routes (with optional auth)
router.get('/', optionalAuth, productController.getProducts);
router.get('/:id', optionalAuth, productController.getProductById);
router.get('/outlet/:outletId', optionalAuth, productController.getProductsByOutlet);

// Protected routes (seller only)
router.post('/', authenticate, authorize('seller', 'admin'), upload.array('images', 10), handleUploadError, productController.createProduct);
router.put('/:id', authenticate, authorize('seller', 'admin'), upload.array('images', 10), handleUploadError, productController.updateProduct);
router.delete('/:id', authenticate, authorize('seller', 'admin'), productController.deleteProduct);

// User interactions
router.post('/:id/like', authenticate, productController.likeProduct);

export default router;

