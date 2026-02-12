import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User';
import Order from './src/models/Order';
import Product from './src/models/Product';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/desi_food_hub');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    console.log('Clearing Database...');
    await Order.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    // 1. Create Users
    console.log('Creating Users...');
    const admin = await User.create({
        name: 'Super Admin',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
    });

    const user = await User.create({
        name: 'Regular Joe',
        email: 'user@example.com',
        password: 'password123',
        role: 'user'
    });
    console.log('Users created.');

    // 2. Create Products
    console.log('Creating Products...');
    const productsList = [
        {
            name: 'Hyderabadi Chicken Biryani',
            description: 'Aromatic basmati rice cooked with tender chicken and authentic spices.',
            price: 350,
            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60',
            category: 'Biryani',
            isVeg: false,
            isBestseller: true
        },
        {
            name: 'Paneer Butter Masala',
            description: 'Cottage cheese cubes in a rich, creamy tomato gravy.',
            price: 280,
            image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60',
            category: 'Curries',
            isVeg: true,
            isBestseller: true
        },
        {
            name: 'Butter Naan',
            description: 'Soft and fluffy leavened bread cooked in Tandoor with butter.',
            price: 45,
            image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&auto=format&fit=crop&q=60',
            category: 'Breads',
            isVeg: true
        },
        {
            name: 'Chicken 65',
            description: 'Spicy, deep-fried chicken dish originating from Chennai.',
            price: 290,
            image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d29f3c?w=500&auto=format&fit=crop&q=60',
            category: 'Starters',
            isVeg: false
        },
        {
            name: 'Gulab Jamun',
            description: 'Deep-fried milk solids soaked in sugar syrup.',
            price: 120,
            image: 'https://images.unsplash.com/photo-1605197584547-c93aa1cd8d77?w=500&auto=format&fit=crop&q=60',
            category: 'Desserts',
            isVeg: true
        }
    ];

    const createdProducts = await Product.insertMany(productsList);
    console.log(`Created ${createdProducts.length} products.`);

    // 3. Create Orders
    console.log('Creating Dummy Orders...');
    const statuses = ['Placed', 'Preparing', 'Out_for_delivery', 'Delivered', 'Cancelled'];
    const orders: any[] = [];

    // Create orders for the last 10 days
    for (let i = 0; i < 25; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 8));

        const isDelivered = randomStatus === 'Delivered';

        // Random items
        const items = [];
        const numItems = Math.floor(Math.random() * 3) + 1;
        let total = 0;

        for (let j = 0; j < numItems; j++) {
            const product = createdProducts[Math.floor(Math.random() * createdProducts.length)];
            const quantity = Math.floor(Math.random() * 2) + 1;

            items.push({
                product: product._id,
                name: product.name,
                quantity: quantity,
                price: product.price,
                image: product.image
            });
            total += product.price * quantity;
        }

        orders.push({
            user: user._id,
            items: items,
            totalAmount: total,
            shippingAddress: '123 Test St, Test City, India',
            paymentMethod: 'COD',
            status: randomStatus,
            isPaid: isDelivered,
            paidAt: isDelivered ? date : null,
            isDelivered: isDelivered,
            deliveredAt: isDelivered ? date : null,
            createdAt: date,
            updatedAt: date
        });
    }

    await Order.insertMany(orders);
    console.log(`Created ${orders.length} dummy orders.`);

    console.log('Data Seeded Successfully!');
    console.log('Admin Credentials: admin@example.com / password123');
    process.exit();
};

seedData();
