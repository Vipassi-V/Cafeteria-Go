const User = require('../models/User');
const Cafeteria = require('../models/Cafeteria');

/**
 * @desc    Get current user profile and role-based redirection data
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cafeteriaId');
    
    // Determine the redirect path for the mobile app
    let redirect = '/scanner'; // Default for unlinked customers
    
    if (user.role === 'superadmin') {
      redirect = '/superadmin';
    } else if (user.role === 'admin') {
      redirect = '/admin';
    } else if (user.role === 'customer' && user.cafeteriaId) {
      redirect = '/menu';
    }

    res.json({
      user,
      redirect
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

/**
 * @desc    Sync user after Supabase OTP verification
 * @route   POST /api/auth/sync
 * @access  Private
 */
const syncUser = async (req, res) => {
  // The 'protect' middleware already syncs the user. 
  // This endpoint serves as a specific 'Entry Point' for the app to call after login.
  res.json({ 
    message: 'User synced successfully',
    user: req.user 
  });
};

module.exports = {
  getMe,
  syncUser
};
