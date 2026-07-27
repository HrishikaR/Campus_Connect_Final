import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import { Star, Users, MapPin, Clock, Calendar, Heart } from 'lucide-react';
import API from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';

export default function ResourceCard({ resource, onBook, isFavorite: initialIsFavorite = false }) {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast('Please sign in to save favorite facilities', 'warning');
      return;
    }
    try {
      const res = await API.post('/favorites/toggle', { resourceId: resource._id });
      setIsFavorite(res.isFavorited);
      addToast(res.message, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="group bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col">
      
      {/* Image Thumbnail Header */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={resource.image}
          alt={resource.name}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge variant="primary">{resource.type}</Badge>
          {resource.isAvailable ? (
            <Badge variant="success">Available</Badge>
          ) : (
            <Badge variant="danger">Occupied</Badge>
          )}
        </div>

        {/* Favorite toggle button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 hover:text-rose-600 hover:scale-105 transition-all shadow-xs"
          title="Save Favorite"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-semibold text-white">
          <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-md backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{resource.rating}</span>
            <span className="text-slate-300 text-[10px]">({resource.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 px-2.5 py-1 rounded-md backdrop-blur-sm text-slate-200">
            <Users className="w-3.5 h-3.5 text-blue-300" />
            <span>Cap: {resource.capacity}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
            {resource.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{resource.building}</span>
          </div>

          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resource.amenities?.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-200">
                {amenity}
              </span>
            ))}
            {resource.amenities?.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">
                +{resource.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Card Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{resource.openingTime} - {resource.closingTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/resources/${resource._id}`}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Details
            </Link>

            <button
              id={`btn-book-${resource._id}`}
              onClick={() => onBook(resource)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" /> Book Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
