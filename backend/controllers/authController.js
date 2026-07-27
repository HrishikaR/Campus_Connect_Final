import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, comparePassword, hashPassword } from '../utils/jwtUtils.js';

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, department, studentId } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const existingUser = await User.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') }).lean();
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    
    const newUserData = {
      _id: userId,
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || 'student',
      department: department || 'General Studies',
      studentId: studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      favorites: [],
      joinedClubs: [],
      joinedEvents: [],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    };

    const userDoc = await User.create(newUserData);
    const user = userDoc.toObject();

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      refreshToken,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') }).lean();
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Logged in successfully',
      token,
      refreshToken,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with that email address' });
    }
    return res.json({
      success: true,
      message: 'Password reset link sent to your registered email address (Demo token generated).'
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email: new RegExp(`^${email.trim()}$`, 'i') }).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { $set: { password: hashedPassword } });
    return res.json({ success: true, message: 'Password updated successfully. Please log in with your new password.' });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is required' });
    }
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const token = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      token,
      refreshToken: newRefreshToken,
      user: userWithoutPassword
    });
  } catch (error) {
    next(error);
  }
};
