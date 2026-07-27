import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    targetAudience: { type: String, default: 'All Students' },
    author: { type: String, default: 'Campus Administration' },
    expiryDate: { type: String }
  },
  {
    timestamps: true,
    _id: false
  }
);

const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
export default Announcement;
