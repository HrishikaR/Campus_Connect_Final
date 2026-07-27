import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  joinEvent,
  leaveEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);

router.use(protect);
router.post('/', authorize('club_admin', 'super_admin'), createEvent);
router.post('/:id/join', joinEvent);
router.post('/:id/leave', leaveEvent);
router.put('/:id', authorize('club_admin', 'super_admin'), updateEvent);
router.delete('/:id', authorize('club_admin', 'super_admin'), deleteEvent);

export default router;
