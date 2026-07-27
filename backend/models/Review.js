import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    resourceId: { type: String, required: true, ref: 'Resource' },
    userId: { type: String, required: true, ref: 'User' },
    userName: { type: String },
    userAvatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true }
  },
  {
    timestamps: true,
    _id: false
  }
);

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;
