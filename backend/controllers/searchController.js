import Resource from '../models/Resource.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Announcement from '../models/Announcement.js';

export const globalSearch = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json({
        success: true,
        results: { resources: [], clubs: [], events: [], announcements: [] }
      });
    }

    const q = query.trim();
    const regex = new RegExp(q, 'i');

    const [resources, clubs, events, announcements] = await Promise.all([
      Resource.find({
        $or: [{ name: regex }, { type: regex }, { building: regex }, { description: regex }]
      }).limit(10).lean(),
      Club.find({
        $or: [{ name: regex }, { category: regex }, { description: regex }]
      }).limit(10).lean(),
      Event.find({
        $or: [{ title: regex }, { description: regex }, { venue: regex }, { clubName: regex }]
      }).limit(10).lean(),
      Announcement.find({
        $or: [{ title: regex }, { content: regex }, { targetAudience: regex }]
      }).limit(10).lean()
    ]);

    res.json({
      success: true,
      results: {
        resources,
        clubs,
        events,
        announcements
      }
    });
  } catch (error) {
    next(error);
  }
};
