// backend/utils/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  // 👇 الحيلة هنا: استخدام النطاق القديم لجوجل لتجاوز الحظر المحتمل
  host: 'smtp.googlemail.com', 
  port: 587,            
  secure: false,        // يجب أن تكون false مع 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // الإبقاء على IPv4 ضروري جداً
  tls: {
    rejectUnauthorized: false
  },
  // إضافة وقت انتظار أقصر حتى لا ننتظر دقيقتين لنعرف النتيجة
  connectionTimeout: 10000, // 10 ثواني
  greetingTimeout: 10000    // 10 ثواني
});

const sendNewOrderEmail = async (order) => {
  try {
    console.log("🚀 Attempting to send email via googlemail.com (Port 587)..."); 
    
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