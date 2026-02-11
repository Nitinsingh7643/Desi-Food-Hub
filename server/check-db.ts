const mongoose = require('mongoose');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/desi_food_hub');
        console.log('--- Connected to MongoDB ---');

        const users = await User.find({});
        console.log(`\nFound ${users.length} users in the database:`);
        console.log(JSON.stringify(users, null, 2));

        console.log('\n--- End of Data ---');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUsers();
