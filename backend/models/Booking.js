import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    userName: { type: String },
    userEmail: { type: String },
    resourceId: { type: String, required: true, ref: 'Resource' },
    resourceName: { type: String },
    resourceType: { type: String },
    building: { type: String },
    bookingDate: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    purpose: { type: String, default: 'Academic study and project collaboration' },
    status: {
      type: String,
      enum: ['Approved', 'Pending', 'Cancelled', 'Rejected'],
      default: 'Approved'
    }
  },
  {
    timestamps: true,
    _id: false
  }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
