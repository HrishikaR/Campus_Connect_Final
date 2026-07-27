import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import { hashPassword, comparePassword } from '../utils/jwtUtils.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, department, studentId, avatar } = req.body;
    const updates = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(bio && { bio }),
      ...(department && { department }),
      ...(studentId && { studentId }),
      ...(avatar && { avatar })
    };
    const updated = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

    const { password, ...userWithoutPassword } = updated;
    res.json({ success: true, message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(req.user._id, { $set: { password: hashed } });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

export const getUserClubs = async (req, res, next) => {
  try {
    const userClubs = await Club.find({
      'members': {
        $elemMatch: { userId: req.user._id, status: 'approved' }
      }
    }).lean();
    res.json({ success: true, clubs: userClubs });
  } catch (error) {
    next(error);
  }
};

export const getUserEvents = async (req, res, next) => {
  try {
    const userEvents = await Event.find({ participants: req.user._id }).lean();
    res.json({ success: true, events: userEvents });
  } catch (error) {
    next(error);
  }
};
