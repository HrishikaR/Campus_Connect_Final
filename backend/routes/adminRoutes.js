import express from 'express';
import { getUsers, updateUserRole, deleteUser, getAnalytics } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, authorize('super_admin'));

router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

export default router;
