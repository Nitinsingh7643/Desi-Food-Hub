import express from 'express';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getAdminStats } from '../controllers/orderController';
import { protect, authorize } from '../middlewares/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, createOrder)
    .get(protect, authorize('admin'), getAllOrders);

router.route('/stats').get(protect, authorize('admin'), getAdminStats);
router.route('/myorders').get(protect, getMyOrders);

router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

export default router;
