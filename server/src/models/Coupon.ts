import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    minOrderValue: number;
    maxDiscount: number;
    validFrom: Date;
    validUntil: Date;
    usageLimit: number;
    usedCount: number;
    isActive: boolean;
}

const couponSchema = new Schema<ICoupon>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },
        discountType: {
            type: String,
            enum: ['percentage', 'fixed'],
            required: true
        },
        discountValue: {
            type: Number,
            required: true
        },
        minOrderValue: {
            type: Number,
            default: 0
        },
        maxDiscount: {
            type: Number,
            default: 0 // 0 means no limit
        },
        validFrom: {
            type: Date,
            default: Date.now
        },
        validUntil: {
            type: Date,
            required: true
        },
        usageLimit: {
            type: Number,
            default: 100 // Default limit
        },
        usedCount: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);

export default Coupon;
