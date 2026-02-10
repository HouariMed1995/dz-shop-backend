// backend/utils/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// 1. إعداد الناقل (Transporter) - تم التعديل لحل مشكلة Timeout
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // تحديد سيرفر جوجل يدوياً
  port: 587,              // استخدام المنفذ 587 (الأكثر استقراراً مع Render)
  secure: false,          // يجب أن يكون false مع المنفذ 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // يمنع مشاكل الشهادات الأمنية التي قد توقف الإرسال
  }
});

// 2. دالة إرسال إشعار طلب جديد
const sendNewOrderEmail = async (order) => {
  try {
    // تجهيز محتوى الإيميل (HTML بسيط وجميل)
    const mailOptions = {
      from: `"DZ Shop Notifications" <${process.env.EMAIL_USER}>`, 
      to: process.env.ADMIN_EMAIL, // إيميل الأدمن (المستقبل)
      // تأكدنا من وجود متغير ADMIN_EMAIL في Render، وإذا لم يوجد سيرسل لنفس الإيميل المرسل
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, 
      subject: `🔔 طلب جديد: ${order.items[0].category} - ${order.totalAmount} د.ج`,
      html: `
        <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #2563eb;">🎉 مبروك! وصلك طلب جديد</h2>
          <p>تفاصيل الطلب أدناه:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>👤 الزبون:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📞 الهاتف:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>🏙️ المدينة:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${order.city}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>💰 المبلغ الإجمالي:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd; color: green; font-weight: bold;">${order.totalAmount} د.ج</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>📅 التاريخ:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${new Date().toLocaleString('ar-DZ')}</td>
            </tr>
          </table>

          <h3>📦 المنتجات المطلوبة:</h3>
          <ul>
            ${order.items.map(item => `<li>${item.name} (العدد: ${item.quantity}) - <small>${item.category}</small></li>`).join('')}
          </ul>

          <p style="margin-top: 20px; color: #777;">يرجى الدخول للوحة التحكم لمراجعة التفاصيل كاملة.</p>
        </div>
      `,
    };

    // إرسال الرسالة فعلياً
    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully to Admin');
  } catch (error) {
    console.error('❌ Error sending email:', error);
    // لن نوقف العملية إذا فشل الإيميل، فقط نسجل الخطأ
  }
};

module.exports = { sendNewOrderEmail };