// backend/utils/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // نستخدم رابط Brevo مباشرة
  port: 2525, // 👈 هذا هو الحل: منفذ بديل لا تحظره الاستضافات
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false
  },
  family: 4 // إجبار استخدام IPv4 لضمان الاستقرار
});

const sendNewOrderEmail = async (order) => {
  try {
    console.log("🚀 Sending email via Brevo (Port 2525)..."); 
    
    const sender = process.env.EMAIL_USER; 
    const recipient = process.env.ADMIN_EMAIL || sender;

    const mailOptions = {
      from: `"DZ Shop" <${sender}>`, 
      to: recipient, 
      subject: `🔔 طلب جديد: ${order.items[0].category} - ${order.totalAmount} د.ج`,
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">طلب جديد! 🎉</h2>
          <p><strong>الزبون:</strong> ${order.customerName}</p>
          <p><strong>الهاتف:</strong> ${order.phone}</p>
          <p><strong>المبلغ:</strong> <span style="color: green; font-weight: bold;">${order.totalAmount} د.ج</span></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
          <p style="font-size: 12px; color: #888;">يمكنك مشاهدة التفاصيل في لوحة التحكم.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully via Brevo:', info.messageId);
  } catch (error) {
    console.error('❌ FATAL Email Error:', error);
  }
};

module.exports = { sendNewOrderEmail };