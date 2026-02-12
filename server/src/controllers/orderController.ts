import { Request, Response } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendOrderConfirmationEmail } from '../utils/emailService';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            isPaid,
            paymentResult
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        } else {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            const order = new Order({
                user: req.user._id,
                items: orderItems,
                shippingAddress,
                paymentMethod,
                totalAmount: totalPrice,
                isPaid: isPaid || false,
                paymentResult: paymentResult || null,
                paidAt: isPaid ? Date.now() : null,
                status: 'Placed'
            });

            const createdOrder = await order.save();

            // Send Confirmation Email
            if (req.user?.email) {
                try {
                    await sendOrderConfirmationEmail(createdOrder, req.user.email);
                } catch (emailError) {
                    console.error("Failed to send order email:", emailError);
                }
            }

            res.status(201).json({
                success: true,
                data: createdOrder
            });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status;

            if (req.body.status === 'Delivered') {
                order.isDelivered = true;
                order.deliveredAt = new Date();

                // If it was COD, mark as paid upon delivery
                if (order.paymentMethod === 'COD') {
                    order.isPaid = true;
                    order.paidAt = new Date();
                }
            }

            const updatedOrder = await order.save();
            res.json({ success: true, data: updatedOrder });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get Admin Stats
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getAdminStats = async (req: Request, res: Response) => {
    try {
        // 1. Total Revenue & Orders
        const totalOrders = await Order.countDocuments();

        // Revenue: Only count Paid orders or Delivered COD
        const totalRevenueResult = await Order.aggregate([
            {
                $match: {
                    $or: [
                        { isPaid: true },
                        { status: 'Delivered' }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" }
                }
            }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

        // 2. Pending & Delivered
        const pendingOrders = await Order.countDocuments({ status: { $in: ['Placed', 'Preparing', 'Out_for_delivery'] } });
        const completedOrders = await Order.countDocuments({ status: 'Delivered' });

        // 3. Daily Stats for Charts (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyStats = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    orders: { $sum: 1 },
                    revenue: {
                        $sum: {
                            $cond: [
                                { $or: ["$isPaid", { $eq: ["$status", "Delivered"] }] },
                                "$totalAmount",
                                0
                            ]
                        }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            totalOrders,
            totalRevenue,
            pendingOrders,
            completedOrders,
            dailyStats
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
