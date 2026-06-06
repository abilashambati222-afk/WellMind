import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import User from './models/User.js';

dotenv.config();

// Configure nodemailer for real email delivery via Gmail
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass || user.includes('your-email') || pass.includes('your-16-character')) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass
    }
  });
};

const sendOtpEmail = async (email, otp) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log('\n================================================================');
    console.log(`  [CONSOLE FALLBACK] SMTP NOT CONFIGURED IN .env!`);
    console.log(`  OTP Code for ${email}: ${otp}`);
    console.log('================================================================\n');
    return false;
  }

  try {
    const mailOptions = {
      from: `"WellMind Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'WellMind Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 20px auto; padding: 32px; border: 1px solid #e4e4e7; border-radius: 24px; background-color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.03);">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #4f46e5; margin: 0; font-size: 1.8rem; font-weight: 800;">WellMind</h2>
            <p style="color: #71717a; font-size: 0.95rem; margin-top: 4px; font-weight: 500;">Your Mental Health & Wellness Portal</p>
          </div>
          <hr style="border: 0; border-top: 1px solid #f4f4f5; margin-bottom: 24px;">
          <p style="color: #27272a; font-size: 1.05rem; line-height: 1.6; margin-bottom: 16px;">Hello,</p>
          <p style="color: #3f3f46; font-size: 1rem; line-height: 1.6; margin-bottom: 24px;">Thank you for joining WellMind. To access your account, please enter the following 6-digit one-time password (OTP):</p>
          
          <div style="text-align: center; margin: 32px 0;">
            <span style="font-size: 2.2rem; font-weight: 800; color: #4f46e5; letter-spacing: 6px; background-color: #f4f4f5; padding: 16px 32px; border-radius: 16px; border: 1px dashed #e4e4e7; display: inline-block;">${otp}</span>
          </div>
          
          <p style="color: #ef4444; font-size: 0.9rem; line-height: 1.6; font-weight: 600; text-align: center; margin-bottom: 24px;">This code is valid for 5 minutes. Do not share it with anyone.</p>
          <hr style="border: 0; border-top: 1px solid #f4f4f5; margin: 24px 0;">
          <p style="color: #a1a1aa; font-size: 0.8rem; text-align: center; line-height: 1.5; margin: 0;">If you did not request this verification code, please ignore this email.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EMAIL SENT] OTP successfully sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`[EMAIL ERROR] Failed to send OTP email to ${email}:`, error);
    console.log(`\n====================================`);
    console.log(`  [CONSOLE FALLBACK] OTP code for ${email}: ${otp}`);
    console.log('====================================\n');
    return false;
  }
};

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wellmind';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, password, age, primaryGoal, stressLevel } = req.body;
    console.log(`[API] Registration request received for email: ${email}`);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      age: age ? Number(age) : undefined,
      primaryGoal,
      stressLevel: stressLevel ? Number(stressLevel) : undefined,
      otp,
      otpExpires,
      occupation: 'Not Specified'
    });

    // Send email verification code
    await sendOtpEmail(email, otp);

    res.status(200).json({
      requiresOtp: true,
      email: newUser.email,
      message: 'Verification code generated. Please check your email or console.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`[API] Login request received for email: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send email verification code
    await sendOtpEmail(email, otp);

    res.status(200).json({
      requiresOtp: true,
      email: user.email,
      message: 'Verification code generated. Please check your email or console.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// Verify OTP Endpoint
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP code.' });
    }

    // OTP verified, clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate signed JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        primaryGoal: user.primaryGoal,
        occupation: user.occupation
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
});

// Update Occupation Endpoint
app.put('/api/user/occupation', async (req, res) => {
  try {
    const { email, occupation } = req.body;

    if (!occupation) {
      return res.status(400).json({ message: 'Occupation is required.' });
    }

    // Try to get email from req.body or decode authorization header if present
    let queryEmail = email;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id);
        if (user) {
          queryEmail = user.email;
        }
      } catch (e) {
        // Ignore token error and fallback to queryEmail
      }
    }

    if (!queryEmail) {
      return res.status(400).json({ message: 'Email or authentication token is required.' });
    }

    const user = await User.findOne({ email: queryEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.occupation = occupation;
    await user.save();

    res.status(200).json({
      message: 'Occupation updated successfully.',
      user: {
        email: user.email,
        occupation: user.occupation
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating occupation.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with MongoDB`);
});
