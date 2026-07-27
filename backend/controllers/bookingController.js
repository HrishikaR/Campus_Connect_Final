import Booking from '../models/Booking.js';
import Resource from '../models/Resource.js';
import Notification from '../models/Notification.js';

export const createBooking = async (req, res, next) => {
  try {
    const { resourceId, bookingDate, startTime, endTime, purpose } = req.body;

    if (!resourceId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({ success: false, message: 'Please specify resource ID, booking date, start time, and end time' });
    }

    const resource = await Resource.findById(resourceId).lean();
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    // Check for overlapping bookings
    const conflict = await Booking.findOne({
      resourceId,
      bookingDate,
      status: { $nin: ['Cancelled', 'Rejected'] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    }).lean();

    if (conflict) {
      return res.status(400).json({
        success: false,
        message: `Time slot conflict! ${resource.name} is already booked from ${conflict.startTime} to ${conflict.endTime} on ${bookingDate}.`
      });
    }

    const bookingId = `bk_${Date.now()}`;
    const newBookingData = {
      _id: bookingId,
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      resourceId: resource._id,
      resourceName: resource.name,
      resourceType: resource.type,
      building: resource.building,
      bookingDate,
      startTime,
      endTime,
      purpose: purpose || 'Academic study and project collaboration',
      status: 'Approved'
    };

    const createdDoc = await Booking.create(newBookingData);
    const booking = createdDoc.toObject();

    // Create confirmation notification
    await Notification.create({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user._id,
      title: "Booking Confirmed",
      message: `Your reservation for ${resource.name} on ${bookingDate} (${startTime} - ${endTime}) is confirmed.`,
      type: "booking",
      isRead: false
    });

    res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      booking
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true }).lean();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Send notification
    await Notification.create({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: booking.userId,
      title: `Booking ${status}`,
      message: `Your booking for ${booking.resourceName} has been ${status.toLowerCase()}.`,
      type: "booking",
      isRead: false
    });

    res.json({ success: true, message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    next(error);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { $set: { status: 'Cancelled' } }, { new: true }).lean();
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    await Notification.create({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: booking.userId,
      title: 'Booking Cancelled',
      message: `Your booking for ${booking.resourceName} has been cancelled.`,
      type: "booking",
      isRead: false
    });

    res.json({ success: true, message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};
