const mongoose = require('mongoose');

const CafeteriaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentQRUrl: { type: String },
  timeSlots: { 
    type: [String], 
    default: ["10:15", "11:30", "12:45", "14:00"] 
  },
  canteenCode: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Cafeteria', CafeteriaSchema);
