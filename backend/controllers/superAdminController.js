const Cafeteria = require('../models/Cafeteria');
const User = require('../models/User');
const Order = require('../models/Order');

/**
 * @desc    Create a new canteen and automatically link/promote an admin
 * @route   POST /api/superadmin/canteen
 * @access  Private (SuperAdmin Only)
 */
const createCanteen = async (req, res) => {
  try {
    const { name, adminEmail, canteenCode } = req.body;

    // 1. Find or Create the Admin User
    let adminUser = await User.findOne({ email: adminEmail.toLowerCase() });
    
    if (!adminUser) {
      // Create a placeholder user if they haven't logged in yet
      adminUser = await User.create({
        name: name + ' Admin',
        email: adminEmail.toLowerCase(),
        role: 'admin'
      });
    } else {
      // Promote existing user to Admin
      adminUser.role = 'admin';
      await adminUser.save();
    }

    // 2. Create the Canteen
    const canteen = await Cafeteria.create({
      name,
      adminId: adminUser._id,
      canteenCode: canteenCode.toUpperCase(),
      isActive: true
    });

    // 3. Link the Admin to this Canteen
    adminUser.cafeteriaId = canteen._id;
    await adminUser.save();

    res.status(201).json({
      message: 'Canteen launched and Admin linked successfully',
      canteen
    });
  } catch (error) {
    console.error('Canteen Creation Error:', error);
    res.status(500).json({ message: 'Error launching new canteen' });
  }
};

/**
 * @desc    Get all canteens and their basic stats
 * @route   GET /api/superadmin/canteens
 * @access  Private (SuperAdmin Only)
 */
const getAllCanteens = async (req, res) => {
  try {
    const canteens = await Cafeteria.find().populate('adminId', 'name email');
    
    // Enrich with order counts (In a real app, use aggregation for performance)
    const enrichedCanteens = await Promise.all(canteens.map(async (c) => {
        const orderCount = await Order.countDocuments({ cafeteriaId: c._id });
        return { ...c.toObject(), orderCount };
    }));

    res.json(enrichedCanteens);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching canteen overview' });
  }
};

/**
 * @desc    Get global platform stats
 * @route   GET /api/superadmin/stats
 * @access  Private (SuperAdmin Only)
 */
const getGlobalStats = async (req, res) => {
    try {
        const totalCanteens = await Cafeteria.countDocuments();
        const totalOrders = await Order.countDocuments();
        const revenueResult = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);
        
        res.json({
            totalCanteens,
            totalOrders,
            totalRevenue: revenueResult[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching platform stats' });
    }
};

module.exports = {
  createCanteen,
  getAllCanteens,
  getGlobalStats
};
