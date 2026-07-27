import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api.js';
import ResourceCard from '../components/resources/ResourceCard.jsx';
import BookingModal from '../components/resources/BookingModal.jsx';
import EventCard from '../components/events/EventCard.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Building2,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Megaphone,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [featuredResources, setFeaturedResources] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookingResource, setBookingResource] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [resData, evtData, ancData] = await Promise.all([
        API.get('/resources'),
        API.get('/events'),
        API.get('/announcements')
      ]);

      if (resData.success) setFeaturedResources(resData.resources.slice(0, 3));
      if (evtData.success) setUpcomingEvents(evtData.events.slice(0, 2));
      if (ancData.success) setAnnouncements(ancData.announcements.slice(0, 2));
    } catch (err) {
      console.error('Failed to load home page data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-900 text-white border border-slate-800 p-8 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl flex flex-col gap-5">
          <div className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-1 rounded-md border border-slate-700/60 self-start">
            <Sparkles className="w-3.5 h-3.5 text-slate-300" /> Campus Operations & Collaboration Platform
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
            Reserve Facilities, Join Societies & Experience Campus Life.
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            CampusConnect provides real-time slot reservation for library pods, computer labs, sports courts, and seminar halls alongside interactive club management and event registrations.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/resources"
              className="bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 shadow-xs"
            >
              <Building2 className="w-4 h-4" /> Explore Facilities
            </Link>

            <Link
              to="/clubs"
              className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4" /> Discover Clubs
            </Link>
          </div>
        </div>
      </section>

      {/* Priority Announcements Banner */}
      {announcements.length > 0 && (
        <section className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-900 shrink-0">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Campus Announcement</span>
                <span className="text-[9px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded font-semibold">Priority</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 mt-0.5">{announcements[0].title}</h4>
              <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{announcements[0].content}</p>
            </div>
          </div>

          <Link
            to="/announcements"
            className="text-xs font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-1 shrink-0"
          >
            All Announcements <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      {/* Key Metrics Quick Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900">12+</span>
            <p className="text-xs text-slate-500 font-medium">Campus Facilities</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900">18+</span>
            <p className="text-xs text-slate-500 font-medium">Student Clubs</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900">100%</span>
            <p className="text-xs text-slate-500 font-medium">Conflict-Free Slots</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3.5 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900">JWT</span>
            <p className="text-xs text-slate-500 font-medium">Role Access</p>
          </div>
        </div>
      </section>

      {/* Featured Resources Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Featured Study Pods & Labs</h2>
            <p className="text-xs text-slate-500 mt-0.5">Book slots instantly with real-time availability checks</p>
          </div>

          <Link
            to="/resources"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            View All Facilities <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} type="card" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredResources.map((res) => (
              <ResourceCard
                key={res._id}
                resource={res}
                onBook={(resource) => setBookingResource(resource)}
                isFavorite={user?.favorites?.includes(res._id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Campus Events */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upcoming Campus Events</h2>
            <p className="text-xs text-slate-500 mt-0.5">RSVP to workshops, hackathons, and cultural fests</p>
          </div>

          <Link
            to="/events"
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            All Events <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={2} type="card" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {upcomingEvents.map((evt) => (
              <EventCard
                key={evt._id}
                event={evt}
                onJoin={async (evtId) => {
                  try {
                    const res = await API.post(`/events/${evtId}/join`);
                    if (res.success) {
                      fetchHomeData();
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
                isJoined={evt.participants?.includes(user?._id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!bookingResource}
        onClose={() => setBookingResource(null)}
        resource={bookingResource}
        onSuccess={() => fetchHomeData()}
      />
    </div>
  );
}
