import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    name: string;
    email: string;
    password?: string; // Optional because select: false might result in it being undefined in some queries
    role: 'user' | 'admin' | 'restaurant';
    avatar: string;
    phone: string;
    address: string;
    createdAt: Date;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'restaurant'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
    },
    phone: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (this: IUser) {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (this: IUser, enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password as string);
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
