const User = require('../models/User');

/**
 * @desc    Sync the user's shopping cart with MongoDB
 * @route   POST /api/cart/sync
 * @access  Private
 */
const syncCart = async (req, res) => {
  try {
    const { cart } = req.body;
    
    // Update the user's cart in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { cart },
      { new: true }
    );

    res.json({ 
      message: 'Cart synced successfully', 
      cart: updatedUser.cart 
    });
  } catch (error) {
    console.error('Cart Sync Error:', error);
    res.status(500).json({ message: 'Error syncing cart' });
  }
};

module.exports = { syncCart };
