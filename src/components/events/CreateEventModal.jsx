import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import API from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';

export default function CreateEventModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [clubName, setClubName] = useState('CodeCraft Developer Society');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('Grand Auditorium Hall A');
  const [capacity, setCapacity] = useState('100');
  const [eventDate, setEventDate] = useState('');
  const [poster, setPoster] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/events', {
        title,
        clubName,
        description,
        venue,
        capacity: Number(capacity),
        eventDate,
        poster: poster || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'
      });
      if (res.success) {
        addToast('Event published successfully!', 'success');
        if (onSuccess) onSuccess(res.event);
        onClose();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Publish Campus Event">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Event Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Annual AI Hackathon & Tech Expo"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hosting Club / Department
            </label>
            <input
              type="text"
              required
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Venue Location
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Grand Auditorium Hall A"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Maximum Capacity
            </label>
            <input
              type="number"
              required
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Event Description & Schedule
          </label>
          <textarea
            rows="3"
            required
            placeholder="Details about keynotes, tracks, prizes, refreshments..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Poster Banner URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={poster}
            onChange={(e) => setPoster(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-xs transition-all"
          >
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
