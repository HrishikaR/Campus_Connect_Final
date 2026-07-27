import express from 'express';
import {
  getClubs,
  getClubById,
  createClub,
  joinClub,
  leaveClub,
  requestMembership,
  approveMembership,
  rejectMembership,
  updateClub
} from '../controllers/clubController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getClubs);
router.get('/:id', getClubById);

router.use(protect);
router.post('/', createClub);
router.post('/:id/join', joinClub);
router.post('/:id/leave', leaveClub);
router.post('/:id/request', requestMembership);
router.post('/:id/approve', approveMembership);
router.post('/:id/reject', rejectMembership);
router.put('/:id', updateClub);

export default router;
