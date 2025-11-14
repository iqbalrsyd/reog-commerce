import express from 'express';
import { authenticate } from '../middleware/auth.js';
import * as orderController from '../controllers/order.controller.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// TODO: Implement order routes
router.post('/checkout', orderController.checkout);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);
router.post('/:id/payment', orderController.uploadPayment);
router.get('/seller/orders', orderController.getSellerOrders);
router.put('/:id/status', orderController.updateOrderStatus);

export default router;

