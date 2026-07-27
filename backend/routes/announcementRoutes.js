import express from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAnnouncements);

router.use(protect);
router.post('/', authorize('super_admin', 'club_admin'), createAnnouncement);
router.put('/:id', authorize('super_admin', 'club_admin'), updateAnnouncement);
router.delete('/:id', authorize('super_admin'), deleteAnnouncement);

export default router;
