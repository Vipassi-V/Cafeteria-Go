const Order = require('../models/Order');
const User = require('../models/User');
const Cafeteria = require('../models/Cafeteria');
const crypto = require('crypto');

/**
 * @desc    Create a new order with anti-fraud screenshot hashing and Real-time emission
 * @route   POST /api/orders
 * @access  Private (Customer only)
 */
const createOrder = async (req, res) => {
  try {
    const { 
      cafeteriaId, 
      items, 
      totalAmount, 
      timeSlot, 
      paymentScreenshotUrl, 
      paymentName 
    } = req.body;

    // 1. Generate a hash of the screenshot URL
    const screenshotHash = crypto.createHash('md5').update(paymentScreenshotUrl).digest('hex');

    // 2. Anti-Fraud Check
    const existingOrder = await Order.findOne({ screenshotHash });
    if (existingOrder) {
      return res.status(400).json({ 
        message: 'This payment receipt has already been submitted.' 
      });
    }

    // 3. Create the Order
    const order = await Order.create({
      cafeteriaId,
      customerId: req.user._id,
      customerName: req.user.name,
      items,
      totalAmount,
      timeSlot,
      paymentScreenshotUrl,
      screenshotHash,
      paymentName,
      status: 'pending'
    });

    // 4. Real-time Notification
    const io = req.app.get('socketio');
    const cafeteria = await Cafeteria.findById(cafeteriaId);
    if (cafeteria && io) {
      // Emit to the specific canteen's room
      io.to(cafeteria.canteenCode).emit('new_order', {
        orderId: order._id,
        items: items,
        customerName: req.user.name,
        totalAmount: totalAmount,
        timeSlot: timeSlot
      });
    }

    // 5. Clear the user's cart
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(201).json({
      message: 'Order placed successfully and is pending approval',
      orderId: order._id
    });
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ message: 'Error processing your order' });
  }
};

/**
 * @desc    Get order history for the current user
 * @route   GET /api/orders/my-history
 * @access  Private
 */
const getMyHistory = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id })
      .populate('cafeteriaId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history' });
  }
};

module.exports = {
  createOrder,
  getMyHistory
};
