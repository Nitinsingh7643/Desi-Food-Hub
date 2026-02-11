import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';

dotenv.config({ path: './.env' });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/desi_food_hub');
        console.log('MongoDB Connected...');

        const email = 'admin@desifood.com';
        const password = 'adminpassword123';

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Admin user already exists');
            userExists.role = 'admin';
            await userExists.save();
            console.log('Updated existing user to admin role');
        } else {
            const user = await User.create({
                name: 'Admin User',
                email,
                password,
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
