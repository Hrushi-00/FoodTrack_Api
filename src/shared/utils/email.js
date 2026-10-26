import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (toEmail, resetToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, 
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"Hotel Management" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Password Reset Request',
      html: `<div style="font-family: Arial; max-width: 600px; margin: 0 auto;">
               <h2>Password Reset Request</h2>
               <p>Click the button below to reset your password:</p>
               <a href="${resetUrl}" style="background:#4CAF50; color:white; padding:12px 24px; text-decoration:none;">Reset Password</a>
               <p>This link will expire in 1 hour.</p>
             </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
