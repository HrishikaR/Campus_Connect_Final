import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, ref: 'User' },
    resourceId: { type: String, required: true, ref: 'Resource' }
  },
  {
    timestamps: true,
    _id: false
  }
);

const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', favoriteSchema);
export default Favorite;
