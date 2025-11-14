import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as cartController from '../controllers/cart.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove', cartController.removeFromCart);
router.delete('/clear', cartController.clearCart);

export default router;

