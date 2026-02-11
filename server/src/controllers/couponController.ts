import { Request, Response } from 'express';
import Coupon from '../models/Coupon';

/*
    @desc    Create a new coupon
    @route   POST /api/coupons
    @access  Private/Admin
*/
export const createCoupon = async (req: Request, res: Response) => {
    try {
        const { code, discountType, discountValue, minOrderValue, maxDiscount, validUntil, usageLimit } = req.body;

        const couponExists = await Coupon.findOne({ code });
        if (couponExists) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            minOrderValue: minOrderValue || 0,
            maxDiscount: maxDiscount || 0,
            validUntil,
            usageLimit: usageLimit || 100
        });

        res.status(201).json({ success: true, data: coupon });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Get all coupons
    @route   GET /api/coupons
    @access  Private/Admin
*/
export const getAllCoupons = async (req: Request, res: Response) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: coupons.length, data: coupons });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Delete coupon
    @route   DELETE /api/coupons/:id
    @access  Private/Admin
*/
export const deleteCoupon = async (req: Request, res: Response) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Toggle coupon active status
    @route   PUT /api/coupons/:id/toggle
    @access  Private/Admin
*/
export const toggleCouponStatus = async (req: Request, res: Response) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.status(200).json({ success: true, data: coupon });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

/*
    @desc    Validate coupon (For Users)
    @route   POST /api/coupons/validate
    @access  Private
*/
export const validateCoupon = async (req: Request, res: Response) => {
    try {
        const { code, orderTotal } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: 'Coupon is inactive' });
        }

        if (new Date() > new Date(coupon.validUntil)) {
            return res.status(400).json({ success: false, message: 'Coupon has expired' });
        }

        if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        }

        if (orderTotal < coupon.minOrderValue) {
            return res.status(400).json({
                success: false,
                message: `Minimum order value of ₹${coupon.minOrderValue} required`
            });
        }

        // Calculate discount
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = (orderTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount > 0 && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
            }
        } else {
            discountAmount = coupon.discountValue;
        }

        // Ensure discount doesn't exceed total
        if (discountAmount > orderTotal) {
            discountAmount = orderTotal;
        }

        res.status(200).json({
            success: true,
            data: {
                code: coupon.code,
                discount: Math.round(discountAmount),
                type: coupon.discountType
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};
