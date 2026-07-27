import Announcement from '../models/Announcement.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({}).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: announcements.length, announcements });
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content, priority, targetAudience, expiryDate } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const ancData = {
      _id: `anc_${Date.now()}`,
      title,
      content,
      priority: priority || 'Medium',
      targetAudience: targetAudience || 'All Students',
      author: req.user ? req.user.name : 'Campus Administration',
      expiryDate
    };

    const doc = await Announcement.create(ancData);
    const anc = doc.toObject();

    // Create notifications for all users
    const allUsers = await User.find({}, '_id').lean();
    const notifs = allUsers.map(u => ({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: u._id,
      title: `Announcement: ${title}`,
      message: content.length > 100 ? content.substring(0, 100) + '...' : content,
      type: "announcement",
      isRead: false
    }));

    if (notifs.length > 0) {
      await Notification.insertMany(notifs);
    }

    res.status(201).json({ success: true, message: 'Announcement created', announcement: anc });
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const anc = await Announcement.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!anc) return res.status(404).json({ success: false, message: 'Announcement not found' });
    res.json({ success: true, message: 'Announcement updated', announcement: anc });
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    next(error);
  }
};
