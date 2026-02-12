import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: string;
    paymentMethod: 'COD' | 'Online';
    paymentResult?: {
        id?: string;
        status?: string;
        update_time?: string;
        email_address?: string;
    };
    totalAmount: number;
    status: 'Placed' | 'Preparing' | 'Out_for_delivery' | 'Delivered' | 'Cancelled';
    isPaid: boolean;
    paidAt?: Date;
    isDelivered: boolean;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            image: { type: String }
        }
    ],
    shippingAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'Online'],
        default: 'COD'
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Placed', 'Preparing', 'Out_for_delivery', 'Delivered', 'Cancelled'],
        default: 'Placed'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true
});

export default mongoose.model<IOrder>('Order', orderSchema);
