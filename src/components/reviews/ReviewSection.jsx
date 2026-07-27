import React, { useState } from 'react';
import Badge from '../common/Badge.jsx';
import API from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { Star, MessageSquare } from 'lucide-react';

export default function ReviewSection({ resourceId, reviews = [], onReviewAdded }) {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please sign in to write a review', 'warning');
      return;
    }
    if (!comment.trim()) {
      addToast('Please enter your review comments', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/reviews', {
        resourceId,
        rating,
        comment
      });
      if (res.success) {
        addToast('Review submitted successfully!', 'success');
        setComment('');
        if (onReviewAdded) onReviewAdded(res.review);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-base text-slate-100">Student Reviews & Ratings</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </span>
      </div>

      {/* Submit New Review Form */}
      {user && (
        <form onSubmit={handleSubmit} className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex flex-col gap-3">
          <span className="text-xs font-semibold text-slate-200">Share your experience with this facility:</span>
          
          {/* Star selector */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-amber-400 hover:scale-125 transition-transform"
              >
                <Star className={`w-5 h-5 ${star <= rating ? 'fill-amber-400' : 'text-slate-700'}`} />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-400 ml-2">{rating}.0 / 5.0</span>
          </div>

          <textarea
            rows="2"
            required
            placeholder="How clean was the room? Were the Wi-Fi, AV, or computers working well?..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-600/20"
            >
              {submitting ? 'Posting...' : 'Post Review'}
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-4 divide-y divide-slate-800/60">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">
            No reviews yet. Be the first student to review this resource facility!
          </p>
        ) : (
          reviews.map((rev) => (
            <div key={rev._id} className="pt-4 first:pt-0 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={rev.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={rev.userName}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-semibold text-xs text-slate-200">{rev.userName}</span>
                    <p className="text-[10px] text-slate-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating}.0</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-9">
                {rev.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
