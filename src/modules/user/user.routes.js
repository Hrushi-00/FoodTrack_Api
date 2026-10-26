import express from 'express';
const router = express.Router();
import {
  login,
  signup,
  getProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  editProfile,
} from './user.controller.js';
import { protect } from "../../shared/middleware/authMiddleware.js";
router.post('/login',    login);
router.post('/signup',  signup);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.post('/change-password', protect, changePassword);
router.put('/update-profile', protect, editProfile);

export default router;
