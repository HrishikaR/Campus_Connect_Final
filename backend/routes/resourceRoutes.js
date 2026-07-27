import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  checkAvailability
} from '../controllers/resourceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getResources);
router.post('/check-availability', checkAvailability);
router.get('/:id', getResourceById);

// Admin / Super Admin routes
router.post('/', protect, authorize('super_admin', 'club_admin'), createResource);
router.put('/:id', protect, authorize('super_admin', 'club_admin'), updateResource);
router.delete('/:id', protect, authorize('super_admin'), deleteResource);

export default router;
