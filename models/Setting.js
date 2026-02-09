const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  // حقل الواتساب (احتفظنا به كما هو)
  whatsappNumber: { type: String, default: '213000000000' },
  
  // حقل صور البانر (احتفظنا به كما هو)
  bannerImages: { type: [String], default: [] },

  // --- الإضافات الجديدة: روابط التواصل الاجتماعي ---
  facebookUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  tiktokUrl: { type: String, default: '' }

}, { timestamps: true }); // يضيف تاريخ الإنشاء والتعديل تلقائياً

module.exports = mongoose.model('Setting', settingSchema);