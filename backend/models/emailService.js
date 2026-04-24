const nodemailer = require('nodemailer');

console.log("Email User:", process.env.EMAIL_USER); // Should print your email, NOT undefined
console.log("Email Pass:", process.env.EMAIL_PASS ? "Loaded" : "Missing");


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to} | Response: ${info.response}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };