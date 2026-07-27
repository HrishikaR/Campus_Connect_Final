import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import EventCard from '../components/events/EventCard.jsx';
import CreateEventModal from '../components/events/CreateEventModal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Calendar, Plus, Search } from 'lucide-react';

export default function EventsPage() {
  const { user, isClubAdmin } = useAuth();
  const { addToast } = useNotification();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get('/events');
      if (res.success) {
        setEvents(res.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async (eventId) => {
    if (!user) {
      addToast('Please sign in to register for events', 'warning');
      return;
    }
    try {
      const res = await API.post(`/events/${eventId}/join`);
      if (res.success) {
        addToast(res.message, 'success');
        fetchEvents();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.clubName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-900" /> Campus Events & Workshops
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Discover annual hackathons, guest lectures, technical summits, and cultural fests
          </p>
        </div>

        {isClubAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Publish Campus Event
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search events by title, venue, host..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-xs"
        />
      </div>

      {/* Events Grid */}
      {loading ? (
        <SkeletonLoader count={6} type="card" />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No campus events found"
          description="Check back soon or search for another term!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isJoined = evt.participants?.includes(user?._id);
            return (
              <EventCard
                key={evt._id}
                event={evt}
                onJoin={handleJoinEvent}
                isJoined={isJoined}
              />
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => fetchEvents()}
      />
    </div>
  );
}
