import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    clubId: { type: String, ref: 'Club' },
    clubName: { type: String },
    poster: {
      type: String,
      default: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
    },
    venue: { type: String, required: true },
    capacity: { type: Number, default: 100 },
    registeredCount: { type: Number, default: 0 },
    eventDate: { type: String, required: true },
    registrationDeadline: { type: String },
    organizerId: { type: String, ref: 'User' },
    status: { type: String, default: 'Upcoming' },
    participants: [{ type: String }]
  },
  {
    timestamps: true,
    _id: false
  }
);

const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
export default Event;
