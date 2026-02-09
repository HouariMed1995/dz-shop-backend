// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  
  items: [
    {
      productId: { type: String },
      name: { type: String },
      price: { type: Number },
      quantity: { type: Number, default: 1 },
      image: { type: String },
      category: { type: String },
      measurements: { type: String }
    }
  ],

  totalAmount: { type: Number, required: true },
  notes: { type: String },
  status: { type: String, default: 'جديد' },
  // --- الحقل الجديد للإشعارات ---
  isRead: { type: Boolean, default: false } 

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);