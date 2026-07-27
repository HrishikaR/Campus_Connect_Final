import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'faculty', 'club_admin', 'super_admin'],
      default: 'student'
    },
    department: { type: String, default: 'General Studies' },
    studentId: { type: String },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    favorites: [{ type: String }],
    joinedClubs: [{ type: String }],
    joinedEvents: [{ type: String }]
  },
  {
    timestamps: true,
    _id: false
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
