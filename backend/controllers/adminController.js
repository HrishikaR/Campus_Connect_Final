import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Booking from '../models/Booking.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';

export const getUsers = async (req, res, next) => {
  try {
    const rawUsers = await User.find({}).lean();
    const users = rawUsers.map(u => {
      const { password, ...safeUser } = u;
      return safeUser;
    });
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['student', 'club_admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role provided' });
    }
    const updated = await User.findByIdAndUpdate(req.params.id, { $set: { role } }, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

    const { password, ...safeUser } = updated;
    res.json({ success: true, message: `User role updated to ${role}`, user: safeUser });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User account removed' });
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalResources, totalBookings, activeClubs, upcomingEvents] = await Promise.all([
      User.countDocuments(),
      Resource.countDocuments(),
      Booking.countDocuments(),
      Club.countDocuments(),
      Event.countDocuments()
    ]);

    const analytics = {
      totalUsers,
      totalResources,
      totalBookings,
      activeClubs,
      upcomingEvents,
      monthlyBookingStats: [
        { month: 'Jan', bookings: 42, studyRooms: 20, labs: 12, halls: 10 },
        { month: 'Feb', bookings: 68, studyRooms: 30, labs: 22, halls: 16 },
        { month: 'Mar', bookings: 95, studyRooms: 45, labs: 30, halls: 20 },
        { month: 'Apr', bookings: 120, studyRooms: 60, labs: 38, halls: 22 },
        { month: 'May', bookings: 140, studyRooms: 72, labs: 43, halls: 25 },
        { month: 'Jun', bookings: 110, studyRooms: 55, labs: 35, halls: 20 },
        { month: 'Jul', bookings: 165, studyRooms: 85, labs: 52, halls: 28 }
      ],
      resourceUsage: [
        { name: 'Study Rooms', value: 45, color: '#3b82f6' },
        { name: 'Computer Labs', value: 25, color: '#10b981' },
        { name: 'Library Seats', value: 15, color: '#f59e0b' },
        { name: 'Auditoriums', value: 10, color: '#8b5cf6' },
        { name: 'Sports Courts', value: 5, color: '#ec4899' }
      ]
    };

    res.json({ success: true, analytics });
  } catch (error) {
    next(error);
  }
};
