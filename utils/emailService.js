// backend/utils/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  // 👇 هذا السطر هو الحل السحري لمشكلة Timeout في Render
  family: 4 // يجبر النظام على استخدام IPv4 بدلاً من IPv6
});

const sendNewOrderEmail = async (order) => {
  try {
    console.log("Attempting to send email..."); // رسالة للتتبع
    const mailOptions = {
      from: `"DZ Shop Notifications" <${process.env.EMAIL_USER}>`, 
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, 
      subject: `🔔 طلب جديد: ${order.items[0].category} - ${order.totalAmount} د.ج`,
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">🎉 مبروك! وصلك طلب جديد</h2>
          <p><strong>المبلغ:</strong> ${order.totalAmount} د.ج</p>
          <p><strong>الزبون:</strong> ${order.customerName}</p>
          <p><strong>الهاتف:</strong> ${order.phone}</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.response);
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
};

module.exports = { sendNewOrderEmail };