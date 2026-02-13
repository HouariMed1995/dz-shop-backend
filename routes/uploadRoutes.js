// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// إعدادات التخزين مع التحسينات المطلوبة
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dz-shop',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    // 👇 بداية التعديل: إعدادات الضغط والتحجيم التلقائي
    transformation: [
      { 
        width: 1000,           // الحد الأقصى للعرض
        crop: "limit",         // تصغير الصورة فقط إذا كانت أكبر من 1000 مع الحفاظ على الأبعاد
        quality: "auto:good",  // ضغط ذكي يقلل الحجم دون التأثير الملحوظ على الجودة
        fetch_format: "auto"   // يحول الصورة تلقائياً لأفضل صيغة (مثل WebP)
      }
    ]
    // 👆 نهاية التعديل
  },
});

// السماح برفع حتى 5 صور دفعة واحدة
const upload = multer({ storage: storage });

router.post('/', upload.array('images', 5), (req, res) => {
  // تجميع روابط الصور المرفوعة
  const urls = req.files.map(file => file.path);
  res.json(urls); // إرسال القائمة للواجهة
});

module.exports = router;