import Event from '../models/Event.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({}).lean();
    res.json({ success: true, count: events.length, events });
  } catch (error) {
    next(error);
  }
};

export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

export const createEvent = async (req, res, next) => {
  try {
    const { title, description, clubId, clubName, poster, venue, capacity, eventDate, registrationDeadline } = req.body;

    if (!title || !description || !venue || !eventDate) {
      return res.status(400).json({ success: false, message: 'Title, description, venue, and event date are required' });
    }

    const eventId = `evt_${Date.now()}`;
    const newEventData = {
      _id: eventId,
      title,
      description,
      clubId: clubId || 'club_code_craft',
      clubName: clubName || 'CodeCraft Developer Society',
      poster: poster || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      venue,
      capacity: Number(capacity) || 100,
      registeredCount: 0,
      eventDate,
      registrationDeadline: registrationDeadline || eventDate,
      organizerId: req.user._id,
      status: "Upcoming",
      participants: []
    };

    const createdDoc = await Event.create(newEventData);
    const newEvent = createdDoc.toObject();

    // Notify users
    const allUsers = await User.find({}, '_id').lean();
    const notifs = allUsers.map(u => ({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: u._id,
      title: "New Event Announced",
      message: `${newEvent.title} hosted by ${newEvent.clubName} is now open for registration!`,
      type: "event",
      isRead: false
    }));

    if (notifs.length > 0) {
      await Notification.insertMany(notifs);
    }

    res.status(201).json({ success: true, message: 'Event published successfully', event: newEvent });
  } catch (error) {
    next(error);
  }
};

export const joinEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    if (event.participants.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'You are already registered for this event.' });
    }

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ success: false, message: 'Event capacity has been reached.' });
    }

    event.participants.push(req.user._id);
    event.registeredCount += 1;
    await event.save();

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { joinedEvents: req.params.id } });

    await Notification.create({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user._id,
      title: "Event Registration Confirmed",
      message: `You are registered for ${event.title} at ${event.venue}.`,
      type: "event",
      isRead: false
    });

    res.json({ success: true, message: 'Registered for event successfully', event: event.toObject() });
  } catch (error) {
    next(error);
  }
};

export const leaveEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    event.participants = event.participants.filter(id => id !== req.user._id);
    event.registeredCount = Math.max(0, event.registeredCount - 1);
    await event.save();

    await User.findByIdAndUpdate(req.user._id, { $pull: { joinedEvents: req.params.id } });

    res.json({ success: true, message: 'Unregistered from event', event: event.toObject() });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event details updated', event: updated });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Event deleted' });
  } catch (error) {
    next(error);
  }
};
