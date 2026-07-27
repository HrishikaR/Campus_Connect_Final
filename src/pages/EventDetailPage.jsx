import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import Badge from '../components/common/Badge.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function EventDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/${id}`);
      if (res.success) {
        setEvent(res.event);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!user) {
      addToast('Please sign in to register for events', 'warning');
      return;
    }

    const isJoined = event?.participants?.includes(user._id);
    try {
      const endpoint = isJoined ? `/events/${id}/leave` : `/events/${id}/join`;
      const res = await API.post(endpoint);
      if (res.success) {
        addToast(res.message, 'success');
        fetchEventDetails();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) return <SkeletonLoader count={1} type="card" />;

  if (!event) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-100">Event Not Found</h2>
        <Link to="/events" className="text-xs text-indigo-400 underline mt-2 inline-block">
          Return to Events Directory
        </Link>
      </div>
    );
  }

  const isJoined = event.participants?.includes(user?._id);

  return (
    <div className="flex flex-col gap-8 pb-12">
      <Link
        to="/events"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Events Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Poster & Main Overview */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="relative h-80 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <img
              src={event.poster}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
            <div className="absolute top-4 left-4">
              <Badge variant="indigo">{event.clubName}</Badge>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4">
            <h1 className="text-2xl font-bold text-slate-100">{event.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-400" /> {new Date(event.eventDate).toLocaleString()}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-indigo-400" /> {event.venue}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-indigo-400" /> {event.registeredCount} / {event.capacity} RSVPs</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800">
              {event.description}
            </p>
          </div>
        </div>

        {/* Sidebar RSVP Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-5 h-fit sticky top-20 shadow-2xl">
          <h3 className="font-bold text-base text-slate-100">Event Registration</h3>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
            <div className="flex justify-between text-slate-400">
              <span>Hosting Society:</span>
              <span className="font-semibold text-white">{event.clubName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Registration Status:</span>
              <span className="font-semibold text-emerald-400">Open to All Students</span>
            </div>
          </div>

          <button
            onClick={handleJoinLeave}
            className={`w-full font-semibold text-xs py-3.5 rounded-2xl shadow-xl transition-all ${
              isJoined
                ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
            }`}
          >
            {isJoined ? 'Unregister RSVP' : 'Confirm RSVP Registration'}
          </button>
        </div>
      </div>
    </div>
  );
}
