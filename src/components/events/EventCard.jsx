import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

export default function EventCard({ event, onJoin, isJoined = false }) {
  const eventDateObj = new Date(event.eventDate);
  const formattedDate = eventDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col">
      
      {/* Poster image */}
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        <img
          src={event.poster}
          alt={event.title}
          className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

        <div className="absolute top-3 left-3">
          <Badge variant="indigo">{event.clubName}</Badge>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md text-xs font-semibold text-white">
          {event.registeredCount} / {event.capacity} RSVPs
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 hover:text-slate-700 transition-colors line-clamp-1">
            {event.title}
          </h3>

          <div className="flex flex-col gap-1 mt-2 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Action footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/events/${event._id}`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={() => onJoin(event._id)}
            disabled={isJoined}
            className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all ${
              isJoined
                ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
          >
            {isJoined ? 'Registered ✓' : 'RSVP Event'}
          </button>
        </div>
      </div>
    </div>
  );
}
