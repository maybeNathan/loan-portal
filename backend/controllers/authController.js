import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateTFA, verifyTFA, enableTFA } from '../middleware/tfa.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, state } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      state,
      role: 'applicant'
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        state: user.state,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, tfaToken } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.tfaEnabled && !tfaToken) {
      return res.status(401).json({
        message: 'TFA token required',
        requiresTFA: true
      });
    }

    if (user.tfaEnabled && tfaToken) {
      const { verified } = await verifyTFA(email, tfaToken);
      if (!verified) {
        return res.status(400).json({ message: 'Invalid TFA token' });
      }
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        state: user.state,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const setupTFA = async (req, res) => {
  try {
    const { email } = req.body;
    const { secret, qrCode, url } = await generateTFA(email);

    res.json({
      secret,
      qrCode,
      url
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const enableTFAEndpoint = async (req, res) => {
  try {
    const { email } = req.body;
    const { enabled } = await enableTFA(email);

    res.json({ enabled });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        state: user.state,
        role: user.role,
        tfaEnabled: user.tfaEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone },
      { new: true }
    );

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
