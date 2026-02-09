// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  // التعديل 1: دعم الصور المتعددة (مصفوفة نصوص)
  images: { type: [String], default: [] }, 
  // نحتفظ بهذا الحقل مؤقتاً لكي لا تتعطل المنتجات القديمة، وسنجعله يأخذ القيمة الأولى من المصفوفة
  image: { type: String }, 
  // التعديل 2: الوصف الاختياري
  description: { type: String, default: "" }, 
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);