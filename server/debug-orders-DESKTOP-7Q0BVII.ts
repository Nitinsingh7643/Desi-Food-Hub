import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from './src/models/Order';
import User from './src/models/User';

dotenv.config();

const debugOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        const orders = await Order.find({}).populate('user', 'name email');
        console.log(`Found ${orders.length} orders:`);

        orders.forEach((order: any) => {
            console.log(`- Order ID: ${order._id}`);
            console.log(`  User: ${order.user ? `${order.user.name} (${order.user.email})` : 'UNKNOWN USER'}`);
            console.log(`  Status: ${order.status}`);
            console.log(`  Total: ${order.totalAmount}`);
            console.log('---');
        });

        const users = await User.find({});
        console.log(`\nFound ${users.length} users:`);
        users.forEach((u: any) => console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

debugOrders();
