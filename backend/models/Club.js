import mongoose from 'mongoose';

const memberSubSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String },
    role: { type: String, default: 'Member' },
    status: { type: String, default: 'approved' }
  },
  { _id: false }
);

const pendingRequestSubSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    name: { type: String },
    email: { type: String },
    statement: { type: String },
    requestedAt: { type: String }
  },
  { _id: false }
);

const clubSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    logo: {
      type: String,
      default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80'
    },
    banner: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80'
    },
    leaderId: { type: String, required: true, ref: 'User' },
    leaderName: { type: String },
    members: [memberSubSchema],
    pendingRequests: [pendingRequestSubSchema],
    createdDate: { type: String }
  },
  {
    timestamps: true,
    _id: false
  }
);

const Club = mongoose.models.Club || mongoose.model('Club', clubSchema);
export default Club;
