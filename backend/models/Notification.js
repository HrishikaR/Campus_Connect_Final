import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['booking', 'club', 'event', 'announcement', 'system'], default: 'system' },
    isRead: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    _id: false
  }
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
export default Notification;
