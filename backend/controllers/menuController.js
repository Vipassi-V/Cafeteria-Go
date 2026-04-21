const MenuItem = require('../models/MenuItem');
const Cafeteria = require('../models/Cafeteria');

/**
 * @desc    Get menu for a specific canteen
 * @route   GET /api/menu/:canteenCode
 * @access  Public
 */
const getMenu = async (req, res) => {
  try {
    const { canteenCode } = req.params;
    const cafeteria = await Cafeteria.findOne({ canteenCode });
    
    if (!cafeteria) {
      return res.status(404).json({ message: 'Canteen not found' });
    }

    const items = await MenuItem.find({ cafeteriaId: cafeteria._id });
    
    // Sort items: Available items first, then Out of Stock
    const sortedItems = items.sort((a, b) => {
      if (a.isAvailable === b.isAvailable) return 0;
      return a.isAvailable ? -1 : 1;
    });

    res.json({
      cafeteria,
      items: sortedItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu' });
  }
};

module.exports = { getMenu };
