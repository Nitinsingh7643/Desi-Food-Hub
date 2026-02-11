import express from 'express';
import {
    createCoupon,
    getAllCoupons,
    deleteCoupon,
    toggleCouponStatus,
    validateCoupon
} from '../controllers/couponController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

// Public/User routes
router.post('/validate', protect, validateCoupon);

// Admin routes
router.route('/')
    .get(protect, authorize('admin'), getAllCoupons)
    .post(protect, authorize('admin'), createCoupon);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteCoupon);

router.put('/:id/toggle', protect, authorize('admin'), toggleCouponStatus);

export default router;
