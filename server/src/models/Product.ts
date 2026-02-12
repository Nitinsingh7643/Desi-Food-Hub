import mongoose, { Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isVeg: boolean;
    isBestseller: boolean;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Biryani', 'Curries', 'Starters', 'Chinese', 'Breads', 'Desserts', 'Beverages']
    },
    isVeg: {
        type: Boolean,
        default: true
    },
    isBestseller: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 4.5
    }
}, {
    timestamps: true
});

export default mongoose.model<IProduct>('Product', productSchema);
