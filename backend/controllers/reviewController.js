import Review from '../models/Review.js';
import Resource from '../models/Resource.js';

export const getResourceReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ resourceId: req.params.resourceId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { resourceId, rating, comment } = req.body;
    if (!resourceId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Resource ID, rating, and review comment are required' });
    }

    const reviewId = `rev_${Date.now()}`;
    const newReviewData = {
      _id: reviewId,
      resourceId,
      rating: Number(rating),
      comment,
      userId: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
    };

    const createdDoc = await Review.create(newReviewData);
    const review = createdDoc.toObject();

    // Recalculate resource average rating
    const resourceReviews = await Review.find({ resourceId }).lean();
    if (resourceReviews.length > 0) {
      const avg = resourceReviews.reduce((sum, r) => sum + r.rating, 0) / resourceReviews.length;
      await Resource.findByIdAndUpdate(resourceId, {
        $set: { rating: Number(avg.toFixed(1)), reviewsCount: resourceReviews.length }
      });
    }

    res.status(201).json({ success: true, message: 'Review submitted successfully', review });
  } catch (error) {
    next(error);
  }
};
