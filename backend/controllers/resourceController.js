import Resource from '../models/Resource.js';
import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

export const getResources = async (req, res, next) => {
  try {
    const { category, building, minCapacity, search } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.type = category;
    }
    if (building && building !== 'All') {
      query.building = { $regex: building, $options: 'i' };
    }
    if (minCapacity) {
      query.capacity = { $gte: Number(minCapacity) };
    }
    if (search) {
      const q = search.trim();
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { building: { $regex: q, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query).lean();
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id).lean();
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource facility not found' });
    }
    const reviews = await Review.find({ resourceId: req.params.id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, resource, reviews });
  } catch (error) {
    next(error);
  }
};

export const createResource = async (req, res, next) => {
  try {
    const resourceData = req.body;
    const newResource = {
      _id: resourceData._id || `res_${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      isAvailable: true,
      amenities: resourceData.amenities || ["Wi-Fi", "Air Conditioning"],
      image: resourceData.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      openingTime: resourceData.openingTime || "08:00",
      closingTime: resourceData.closingTime || "22:00",
      slotDurationMinutes: Number(resourceData.slotDurationMinutes) || 60,
      ...resourceData
    };

    const doc = await Resource.create(newResource);
    res.status(201).json({ success: true, message: 'Resource facility created successfully', resource: doc.toObject() });
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (req, res, next) => {
  try {
    const updated = await Resource.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    res.json({ success: true, message: 'Resource updated', resource: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (req, res, next) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};

export const checkAvailability = async (req, res, next) => {
  try {
    const { resourceId, date, startTime, endTime } = req.body;
    const conflict = await Booking.findOne({
      resourceId,
      bookingDate: date,
      status: { $nin: ['Cancelled', 'Rejected'] },
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    }).lean();

    res.json({
      success: true,
      available: !conflict,
      message: conflict
        ? `Slot occupied by ${conflict.userName} (${conflict.startTime} - ${conflict.endTime})`
        : 'Time slot is available for booking'
    });
  } catch (error) {
    next(error);
  }
};
