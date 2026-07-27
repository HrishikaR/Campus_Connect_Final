import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getUserBookings,
  getUserClubs,
  getUserEvents
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/bookings', getUserBookings);
router.get('/clubs', getUserClubs);
router.get('/events', getUserEvents);

export default router;
