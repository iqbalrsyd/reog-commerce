import express from 'express';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { upload, handleUploadError } from '../utils/upload.js';
import * as eventController from '../controllers/event.controller.js';

const router = express.Router();

// Public routes (with optional auth)
router.get('/', optionalAuth, eventController.getEvents);
router.get('/:id', optionalAuth, eventController.getEventById);
router.get('/outlet/:outletId', optionalAuth, eventController.getEventsByOutlet);

// Protected routes (seller only)
router.post('/', authenticate, authorize('seller', 'admin'), upload.array('images', 10), handleUploadError, eventController.createEvent);
router.put('/:id', authenticate, authorize('seller', 'admin'), upload.array('images', 10), handleUploadError, eventController.updateEvent);
router.delete('/:id', authenticate, authorize('seller', 'admin'), eventController.deleteEvent);

export default router;

