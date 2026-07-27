import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import Badge from '../components/common/Badge.jsx';
import ReviewSection from '../components/reviews/ReviewSection.jsx';
import BookingModal from '../components/resources/BookingModal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import {
  MapPin,
  Users,
  Clock,
  Star,
  CheckCircle2,
  Heart,
  Calendar,
  ArrowLeft
} from 'lucide-react';

export default function ResourceDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [resource, setResource] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchResourceDetails();
  }, [id]);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      const data = await API.get(`/resources/${id}`);
      if (data.success) {
        setResource(data.resource);
        setReviews(data.reviews || []);
        if (user && user.favorites) {
          setIsFavorite(user.favorites.includes(data.resource._id));
        }
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      addToast('Please sign in to favorite resources', 'warning');
      return;
    }
    try {
      const res = await API.post('/favorites/toggle', { resourceId: id });
      setIsFavorite(res.isFavorited);
      addToast(res.message, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) return <SkeletonLoader count={1} type="card" />;

  if (!resource) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-100">Facility Not Found</h2>
        <Link to="/resources" className="text-xs text-blue-400 underline mt-2 inline-block">
          Return to Facilities Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Top back nav */}
      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Facilities Catalog
      </Link>

      {/* Hero Banner Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Image & Quick Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative h-80 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <img
              src={resource.image}
              alt={resource.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge variant="primary">{resource.type}</Badge>
              <Badge variant={resource.isAvailable ? 'success' : 'danger'}>
                {resource.isAvailable ? 'Available for Booking' : 'Occupied'}
              </Badge>
            </div>

            <button
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 p-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-700/50 text-slate-200 hover:text-rose-500 transition-all shadow-lg"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Description & Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-slate-100">{resource.name}</h1>
            
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-400" /> {resource.building}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4 text-blue-400" /> Max Cap: {resource.capacity}
              </span>
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-400" /> {resource.rating} ({resource.reviewsCount} reviews)
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
              {resource.description}
            </p>

            {/* Amenities Grid */}
            <div className="pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Equipment & Amenities
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {resource.amenities?.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Booking Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-5 sticky top-20 shadow-2xl">
            <h3 className="font-bold text-base text-slate-100">Reserve Facility Slot</h3>
            
            <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Operating Hours:</span>
                <span className="font-semibold text-white">{resource.openingTime} - {resource.closingTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Slot Duration:</span>
                <span className="font-semibold text-white">{resource.slotDurationMinutes} mins per block</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Access Policy:</span>
                <span className="font-semibold text-emerald-400">Instant Student Approval</span>
              </div>
            </div>

            <button
              id="btn-reserve-slot-detail"
              onClick={() => setShowBookingModal(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs py-3.5 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Reserve Slot Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <ReviewSection
        resourceId={resource._id}
        reviews={reviews}
        onReviewAdded={() => fetchResourceDetails()}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        resource={resource}
        onSuccess={() => fetchResourceDetails()}
      />
    </div>
  );
}
