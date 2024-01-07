const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      text: text
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent!");
    console.log(error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
