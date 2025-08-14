// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html }) {
  try {
    // Create transporter using your email credentials
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // you can change to any service like Outlook, Yahoo, etc.
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email password or app password
      },
    });

    // Send mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending error:', error);
    throw new Error('Email could not be sent');
  }
}
