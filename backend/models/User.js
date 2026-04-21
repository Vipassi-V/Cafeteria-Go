const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { 
    type: String, 
    enum: ['superadmin', 'admin', 'customer'], 
    default: 'customer' 
  },
  cafeteriaId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Cafeteria' 
  },
  faculty: { type: String },
  cart: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, default: 1 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
