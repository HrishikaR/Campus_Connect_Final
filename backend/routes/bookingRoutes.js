import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.put('/:id/cancel', cancelBooking);

// Admin routes
router.get('/all', authorize('super_admin', 'club_admin'), getAllBookings);
router.put('/:id/status', authorize('super_admin', 'club_admin'), updateBookingStatus);

export default router;
