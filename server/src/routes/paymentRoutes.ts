import express, { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { protect, AuthRequest } from '../middlewares/authMiddleware';

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere'
});

// @desc    Create Razorpay Order
// @route   POST /api/payment/create-order
// @access  Private
router.post('/create-order', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { amount } = req.body; // Amount in INR

        const options = {
            amount: Math.round(amount * 100), // convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });
    } catch (error: any) {
        console.error("Razorpay Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @desc    Verify Payment
// @route   POST /api/payment/verify
// @access  Private
router.post('/verify', protect, async (req: AuthRequest, res: Response) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            res.json({ success: true, message: "Payment Verified" });
        } else {
            res.status(400).json({ success: false, error: "Invalid Signature" });
        }
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
