const Order = require('../models/Order');

/**
 * @desc    Get all orders for the admin's canteen
 * @route   GET /api/admin/orders
 * @access  Private (Admin only)
 */
const getAdminOrders = async (req, res) => {
  try {
    if (req.user.role !== 'admin' || !req.user.cafeteriaId) {
      return res.status(403).json({ message: 'Access denied: Requires Admin role and linked canteen' });
    }

    const orders = await Order.find({ cafeteriaId: req.user.cafeteriaId })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching canteen orders' });
  }
};

/**
 * @desc    Update order status (Accept or Ready)
 * @route   PATCH /api/admin/orders/:id/status
 * @access  Private (Admin only)
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Safety Check: Admins cannot cancel orders via this endpoint as per user instruction
    if (status === 'cancelled') {
        return res.status(400).json({ message: 'Admins are not authorized to cancel orders.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure admin only updates their own canteen's orders
    if (order.cafeteriaId.toString() !== req.user.cafeteriaId._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this canteen' });
    }

    order.status = status;
    await order.save();

    // Notify the user via real-time socket
    const io = req.app.get('socketio');
    if (io) {
        // Emit to the specific user's individual room (using their ID)
        io.to(order.customerId.toString()).emit('order_status_updated', {
            orderId: order._id,
            status: status
        });
    }

    res.json({ message: `Order marked as ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

module.exports = {
  getAdminOrders,
  updateOrderStatus
};
