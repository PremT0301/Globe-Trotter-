const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../lib/emailService');
const { generateEmailVerificationToken, generatePasswordResetToken } = require('../lib/tokenUtils');
const { validateSignupData, validateLoginData, validateEmailVerification } = require('../lib/validation');

const router = express.Router();

// Signup without email verification
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, languagePref } = req.body;
    
    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() }).lean();
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered. Please login or use a different email.' });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      languagePref,
      emailVerified: true, // Auto-verify for OTP system
    });

    res.status(201).json({
      message: 'Account created successfully! You can now login.',
      user: { id: user._id, name: user.name, email: user.email, emailVerified: true },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Generate OTP for login
router.post('/generate-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.emailVerificationToken = otp;
    user.emailVerificationExpires = otpExpires;
    await user.save();

    try {
      await sendVerificationEmail(user.email, user.name, otp);
      res.json({ message: 'OTP sent to your email. Please check your inbox.' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
  } catch (error) {
    console.error('Generate OTP error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.emailVerificationToken || user.emailVerificationToken !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // Clear OTP after successful verification
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    const token = jwt.sign({ userId: String(user._id), email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, emailVerified: true },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Traditional password login (kept as backup)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: String(user._id), email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful!',
      token,
      user: { id: user._id, name: user.name, email: user.email, emailVerified: true, languagePref: user.languagePref },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    const resetToken = generatePasswordResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000);

    user.emailVerificationToken = resetToken;
    user.emailVerificationExpires = resetExpires;
    await user.save();

    await sendPasswordResetEmail(email, user.name, resetToken);

    res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required' });

    const { isStrongPassword } = require('../lib/validation');
    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters with uppercase, lowercase, and number' });
    }

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid reset token' });

    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return res.status(400).json({ message: 'Reset token has expired. Please request a new one.' });
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);
    user.passwordHash = newPasswordHash;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ message: 'Password reset successfully! You can now login with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Access token required' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user: { id: String(user._id), name: user.name, email: user.email, emailVerified: user.emailVerified, languagePref: user.languagePref, createdAt: user.createdAt } });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ message: 'Invalid token' });
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

module.exports = router;


