// backend/utils/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,            // 1. استخدام المنفذ الآمن
  secure: true,         // ضروري مع 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // 2. إجبار النظام على استخدام IPv4 فقط (الحل لمشكلة ENETUNREACH)
  family: 4, 
  tls: {
    rejectUnauthorized: false
  }
});

const sendNewOrderEmail = async (order) => {
  try {
    console.log("🚀 Attempting to send email via Port 465 (IPv4)..."); 
    
    const recipient = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: `"DZ Shop" <${process.env.EMAIL_USER}>`, 
      to: recipient, 
      subject: `🔔 طلب جديد بقيمة: ${order.totalAmount} د.ج`,
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">طلب جديد! 🎉</h2>
          <p><strong>الزبون:</strong> ${order.customerName}</p>
          <p><strong>الهاتف:</strong> ${order.phone}</p>
          <p><strong>المجموع:</strong> <span style="color: green; font-weight: bold;">${order.totalAmount} د.ج</span></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
          <p style="font-size: 12px; color: #888;">يمكنك مشاهدة التفاصيل في لوحة التحكم.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ FATAL Email Error:', error);
  }
};

module.exports = { sendNewOrderEmail };