// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// دالة استخراج Public ID
const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch (e) {
    console.error("Error extracting Public ID:", e);
    return null;
  }
};

// 1. جلب كل المنتجات
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. إضافة منتج
router.post('/', async (req, res) => {
  const { name, price, category, image, images, description } = req.body; 
  try {
    const newProduct = new Product({ name, price, category, image, images, description });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. تعديل منتج
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, req.body, { new: true } 
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. حذف منتج (الإصلاح هنا: حذف جميع الصور)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });

    // --- 1. تجميع كل الروابط في قائمة واحدة ---
    let allImagesToDelete = [];

    // أ) إضافة الصورة الرئيسية (إذا وجدت)
    if (product.image) {
      allImagesToDelete.push(product.image);
    }

    // ب) إضافة الصور الإضافية (إذا وجدت وكانت مصفوفة)
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      allImagesToDelete = allImagesToDelete.concat(product.images);
    }

    console.log(`Deleting product: ${product.name}`);
    console.log(`Total images to delete: ${allImagesToDelete.length}`);

    // --- 2. الحذف الفعلي من Cloudinary ---
    for (const url of allImagesToDelete) {
      const publicId = getPublicIdFromUrl(url);
      
      if (publicId) {
        try {
            const result = await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted image (${publicId}):`, result);
        } catch (cloudErr) {
            console.error(`Failed to delete image (${publicId}):`, cloudErr);
        }
      }
    }

    // --- 3. حذف المنتج من قاعدة البيانات ---
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف المنتج وجميع صوره بنجاح' });

  } catch (err) {
    console.error("Delete Route Error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;