require('dotenv').config();
const mongoose = require('mongoose');
const Cafeteria = require('./models/Cafeteria');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing data (Optional, for clean state)
    await Cafeteria.deleteMany({});
    await MenuItem.deleteMany({});

    // 2. Create a Demo Admin User (Mock)
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
        adminUser = await User.create({
            name: 'Demo Admin',
            email: 'admin@school.edu',
            role: 'admin'
        });
    }

    // 3. Create a Demo Canteen
    const canteen = await Cafeteria.create({
      name: 'Springfield High Canteen',
      adminId: adminUser._id,
      canteenCode: 'DEMO-CANTEEN-001',
      timeSlots: ["10:15", "11:30", "12:45", "14:00"]
    });

    // 4. Create Menu Items
    const items = [
      {
        cafeteriaId: canteen._id,
        name: 'Classic Cheese Burger',
        price: 150,
        category: 'Burgers',
        description: 'Juicy beef patty with extra cheese.',
        isAvailable: true
      },
      {
        cafeteriaId: canteen._id,
        name: 'Veggie Delight Pizza',
        price: 250,
        category: 'Pizza',
        description: 'Loaded with bell peppers, onions, and olives.',
        isAvailable: true
      },
      {
        cafeteriaId: canteen._id,
        name: 'Chicken Steamed Momos',
        price: 120,
        category: 'Momos',
        description: 'Served with spicy sesame dip.',
        isAvailable: true
      },
      {
        cafeteriaId: canteen._id,
        name: 'Cold Coffee with Ice Cream',
        price: 80,
        category: 'Drinks',
        isAvailable: true
      },
      {
        cafeteriaId: canteen._id,
        name: 'Grilled Chicken Sandwich',
        price: 180,
        category: 'Sandwiches',
        isAvailable: false // TEST: Should appear at the bottom
      }
    ];

    await MenuItem.insertMany(items);
    console.log('Seed successful! Added 1 Canteen and 5 Menu Items.');
    process.exit();
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedData();
