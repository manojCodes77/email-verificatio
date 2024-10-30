import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  // host: "smtp.gmail.com",
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});



export default transporter;

//   port: 587,
//   secure: false, // true for 465, false for other ports like 587