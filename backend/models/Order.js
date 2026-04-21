const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  cafeteriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafeteria', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: { type: String, required: true },
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String },
    quantity: { type: Number },
    price: { type: Number },
    cookedQuantity: { type: Number, default: 0 }
  }],
  totalAmount: { type: Number, required: true },
  timeSlot: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'ready', 'cancelled'], 
    default: 'pending' 
  },
  paymentScreenshotUrl: { type: String },
  screenshotHash: { type: String },
  paymentName: { type: String },
  hiddenFromCustomer: { type: Boolean, default: false }
}, { 
  timestamps: true,
  expires: '24h' 
});

module.exports = mongoose.model('Order', OrderSchema);
