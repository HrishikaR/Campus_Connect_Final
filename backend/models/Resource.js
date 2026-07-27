import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }, // Study Rooms, Computer Labs, Library Seats, etc.
    building: { type: String, required: true },
    capacity: { type: Number, required: true, default: 1 },
    description: { type: String, default: '' },
    amenities: [{ type: String }],
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
    },
    isAvailable: { type: Boolean, default: true },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    openingTime: { type: String, default: '08:00' },
    closingTime: { type: String, default: '22:00' },
    slotDurationMinutes: { type: Number, default: 60 }
  },
  {
    timestamps: true,
    _id: false
  }
);

const Resource = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);
export default Resource;
