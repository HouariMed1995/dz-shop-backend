// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { sendNewOrderEmail } = require('../utils/emailService'); // أ

// 1. جلب كل الطلبات
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. إنشاء طلب جديد
router.post('/', async (req, res) => {
  try {
    // عند إنشاء طلب جديد، isRead سيكون false تلقائياً
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    sendNewOrderEmail(savedOrder);
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. تحديث حالة القراءة (جديد للإشعارات)
router.put('/:id/read', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { isRead: true }, // اجعله مقروءاً
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. حذف طلب
router.delete('/:id', async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'تم حذف الطلب بنجاح' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;