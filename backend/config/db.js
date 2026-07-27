import mongoose from 'mongoose';
import {
  initialUsers,
  initialResources,
  initialClubs,
  initialEvents,
  initialAnnouncements,
  initialBookings,
  initialReviews,
  initialNotifications
} from '../data/seedData.js';

import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import Announcement from '../models/Announcement.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Notification from '../models/Notification.js';
import Favorite from '../models/Favorite.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campusconnect';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    await seedDatabaseIfEmpty();
    return true;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Notice: ${error.message}`);
    console.warn(`Running in fallback hybrid mode until MongoDB is reachable at ${MONGODB_URI}`);
    return false;
  }
};

async function seedDatabaseIfEmpty() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding database with initial CampusConnect records...');
      await User.insertMany(initialUsers);
      await Resource.insertMany(initialResources);
      await Club.insertMany(initialClubs);
      await Event.insertMany(initialEvents);
      await Announcement.insertMany(initialAnnouncements);
      await Booking.insertMany(initialBookings);
      await Review.insertMany(initialReviews);
      await Notification.insertMany(initialNotifications);

      // Seed initial favorites for users
      const favsToInsert = [];
      initialUsers.forEach(u => {
        if (u.favorites && u.favorites.length > 0) {
          u.favorites.forEach(rid => {
            favsToInsert.push({
              _id: `fav_${u._id}_${rid}`,
              userId: u._id,
              resourceId: rid,
              createdAt: new Date().toISOString()
            });
          });
        }
      });
      if (favsToInsert.length > 0) {
        await Favorite.insertMany(favsToInsert);
      }

      console.log('✅ Initial seed data populated in MongoDB successfully!');
    }
  } catch (err) {
    console.error('Error seeding initial database records:', err.message);
  }
}
