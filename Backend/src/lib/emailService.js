const nodemailer = require('nodemailer');

// Create a test account using Ethereal Email (for development)
// In production, you would use real SMTP credentials
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    throw error;
  }
};

// Create transporter for production (you can configure this later)
const createProductionTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Get the appropriate transporter
const getTransporter = async () => {
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return createProductionTransporter();
  } else {
    return await createTestAccount();
  }
};

// Send OTP email
const sendVerificationEmail = async (email, name, otp) => {
  try {
    const transporter = await getTransporter();
    
    const mailOptions = {
      from: process.env.SMTP_USER || '"Globetrotter" <noreply@globetrotter.com>',
      to: email,
      subject: 'Your Login OTP - Globetrotter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; text-align: center;">🔐 Your Login OTP</h2>
          <p>Hi ${name},</p>
          <p>Here's your one-time password (OTP) to login to your GlobeTrotter account:</p>
          <div style="text-align: center; margin: 30px 0;">
            <div style="background-color: #f8f9fa; border: 2px solid #3498db; border-radius: 10px; padding: 20px; display: inline-block;">
              <h1 style="color: #3498db; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p>Best regards,<br>The GlobeTrotter Team</p>
        </div>
      `,
      text: `
        Your Login OTP - GlobeTrotter
        
        Hi ${name},
        
        Here's your one-time password (OTP) to login to your GlobeTrotter account:
        
        ${otp}
        
        This OTP will expire in 10 minutes.
        
        If you didn't request this OTP, please ignore this email.
        
        Best regards,
        The GlobeTrotter Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 OTP Email sent (development mode):');
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const transporter = await getTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_USER || '"Globetrotter" <noreply@globetrotter.com>',
      to: email,
      subject: 'Reset Your Password - Globetrotter',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50; text-align: center;">🔐 Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #e74c3c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #7f8c8d;">${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>The Globetrotter Team</p>
        </div>
      `,
      text: `
        Password Reset Request
        
        Hi ${name},
        
        We received a request to reset your password. Click the link below to create a new password:
        
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        The Globetrotter Team
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Password reset email sent (development mode):');
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
