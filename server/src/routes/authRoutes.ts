import express from 'express';
// Assuming these will be exported from authController.ts
import { register, login, getMe, updateDetails, updatePassword, googleAuth } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);
router.post('/google', googleAuth);

// Admin User Management
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/authController';
import { authorize } from '../middlewares/authMiddleware';

router.route('/users')
    .get(protect, authorize('admin'), getAllUsers)
    .post(protect, authorize('admin'), createUser);

router.route('/users/:id')
    .put(protect, authorize('admin'), updateUser)
    .delete(protect, authorize('admin'), deleteUser);

export default router;
