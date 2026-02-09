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

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dz-shop',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

// التعديل: السماح برفع حتى 5 صور دفعة واحدة
const upload = multer({ storage: storage });

router.post('/', upload.array('images', 5), (req, res) => {
  // تجميع روابط الصور المرفوعة
  const urls = req.files.map(file => file.path);
  res.json(urls); // إرسال القائمة للواجهة
});

module.exports = router;