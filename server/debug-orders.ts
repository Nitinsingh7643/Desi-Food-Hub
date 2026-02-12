require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./src/models/Order');
const User = require('./src/models/User');

const debugOrders = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const orders = await Order.find({}).populate('user', 'name email');
        console.log(`Found ${orders.length} orders:`);

        orders.forEach(order => {
            console.log(`- Order ID: ${order._id}`);
            console.log(`  User: ${order.user ? `${order.user.name} (${order.user.email})` : 'UNKNOWN USER'}`);
            console.log(`  Status: ${order.status}`);
            console.log(`  Total: ${order.totalAmount}`);
            console.log('---');
        });

        const users = await User.find({});
        console.log(`\nFound ${users.length} users:`);
        users.forEach(u => console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

debugOrders();
