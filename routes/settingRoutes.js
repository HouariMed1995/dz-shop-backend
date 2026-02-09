// backend/routes/settingRoutes.js
const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// جلب الإعدادات (واتساب + بانر + روابط التواصل)
router.get('/', async (req, res) => {
  try {
    // نجلب أول وثيقة إعدادات، أو ننشئ واحدة فارغة إذا لم توجد
    let settings = await Setting.findOne();
    if (!settings) {
      // عند الإنشاء، الحقول الجديدة ستأخذ القيم الافتراضية من السكيما تلقائياً
      settings = await Setting.create({ whatsappNumber: '', bannerImages: [] });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تحديث الإعدادات
router.put('/', async (req, res) => {
  // 1. استقبال الحقول الجديدة (facebookUrl, instagramUrl, tiktokUrl)
  const { whatsappNumber, bannerImages, facebookUrl, instagramUrl, tiktokUrl } = req.body;
  
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      // إنشاء إعدادات جديدة مع الحقول الجديدة
      settings = new Setting({ 
        whatsappNumber, 
        bannerImages,
        facebookUrl,
        instagramUrl,
        tiktokUrl
      });
    } else {
      // تحديث الحقول الموجودة
      if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
      if (bannerImages !== undefined) settings.bannerImages = bannerImages;
      
      // 2. تحديث روابط التواصل الاجتماعي إذا تم إرسالها
      if (facebookUrl !== undefined) settings.facebookUrl = facebookUrl;
      if (instagramUrl !== undefined) settings.instagramUrl = instagramUrl;
      if (tiktokUrl !== undefined) settings.tiktokUrl = tiktokUrl;
    }
    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;