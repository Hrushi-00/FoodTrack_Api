import express from 'express';
import {
  getDashboardStats,
  getPopularItems,
  getRecentActivity
} from './dashboard.controller.js';
import { protect } from '../../shared/middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, getDashboardStats);
router.get('/popular-items', protect, getPopularItems);
router.get('/recent-activity', protect, getRecentActivity);

export default router;
