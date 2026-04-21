const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  cafeteriaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cafeteria', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', MenuItemSchema);
