const { createClient } = require('@supabase/supabase-js');
const User = require('../models/User');

// Initialize Supabase Admin Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service key to bypass RLS and verify tokens
);

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // 2. Find/Sync with MongoDB User
    let mongoUser = await User.findOne({ email: user.email });
    
    if (!mongoUser) {
      // Lazy creation if user exists in Supabase but not MongoDB yet
      mongoUser = await User.create({
        name: user.user_metadata?.name || user.email.split('@')[0],
        email: user.email,
        role: 'customer'
      });
    }

    // Attach user to request
    req.user = mongoUser;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ message: 'Authentication server error' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};

module.exports = { protect, authorize };
