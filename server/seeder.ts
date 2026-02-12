import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product';

dotenv.config({ path: './.env' });

const products = [
    {
        name: "Chicken Dum Biryani",
        image: "https://images.unsplash.com/photo-1563245372-f21727e5a3c6?q=80&w=1000&auto=format&fit=crop",
        rating: 4.8,
        price: 299,
        description: "Aromatic basmati rice cooked with tender chicken and authentic spices.",
        category: "Biryani",
        isVeg: false,
        isBestseller: true
    },
    {
        name: "Paneer Butter Masala",
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?q=80&w=1000&auto=format&fit=crop",
        rating: 4.6,
        price: 249,
        description: "Cottage cheese cubes simmered in a rich and creamy tomato gravy.",
        category: "Curries",
        isVeg: true,
        isBestseller: true
    },
    {
        name: "Garlic Naan",
        image: "https://images.unsplash.com/photo-1645177628172-a94c1f96e6ec?q=80&w=1000&auto=format&fit=crop",
        rating: 4.5,
        price: 45,
        description: "Soft leavened bread topped with minced garlic and butter.",
        category: "Breads",
        isVeg: true
    },
    {
        name: "Tandoori Chicken (Half)",
        image: "https://duyt4h9nfnj50.cloudfront.net/resized/1539360897585-w2880-60.jpg",
        rating: 4.7,
        price: 350,
        description: "Roasted chicken marinated in yogurt and spices in a tandoor.",
        category: "Starters",
        isVeg: false
    },
    {
        name: "Dal Makhani",
        image: "https://www.secondrecipe.com/wp-content/uploads/2017/08/dal-makhani-1.jpg",
        rating: 4.5,
        price: 199,
        description: "Black lentils cooked with butter and cream for a rich flavor.",
        category: "Curries",
        isVeg: true
    },
    {
        name: "Veg Hakka Noodles",
        image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?q=80&w=1000&auto=format&fit=crop",
        rating: 4.3,
        price: 180,
        description: "Stir-fried noodles with fresh vegetables and soy sauce.",
        category: "Chinese",
        isVeg: true
    },
    {
        name: "Gulab Jamun (2 pcs)",
        image: "https://images.unsplash.com/photo-1541604193435-22287d32c21e?q=80&w=1000&auto=format&fit=crop",
        rating: 4.9,
        price: 80,
        description: "Soft milk solids dumplings soaked in rose flavored sugar syrup.",
        category: "Desserts",
        isVeg: true
    },
    {
        name: "Chicken 65",
        image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=1000&auto=format&fit=crop",
        rating: 4.4,
        price: 260,
        description: "Spicy, deep-fried chicken dish originating from Chennai.",
        category: "Starters",
        isVeg: false
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/desi_food_hub');
        console.log('MongoDB Connected...');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Data Destroyed...');

        // Import new products
        await Product.insertMany(products);
        console.log('Data Imported!');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
