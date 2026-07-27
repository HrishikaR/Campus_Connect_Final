import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Megaphone, Plus, Calendar, UserCheck } from 'lucide-react';

export default function AnnouncementsPage() {
  const { user, isClubAdmin } = useAuth();
  const { addToast } = useNotification();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New announcement state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [targetAudience, setTargetAudience] = useState('All Students');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await API.get('/announcements');
      if (res.success) {
        setAnnouncements(res.announcements);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await API.post('/announcements', {
        title,
        content,
        priority,
        targetAudience
      });
      if (res.success) {
        addToast('Announcement posted successfully!', 'success');
        setTitle('');
        setContent('');
        setShowCreateModal(false);
        fetchAnnouncements();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-slate-900" /> Campus Announcements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official university updates, exam library hours, and sports complex maintenance notices
          </p>
        </div>

        {isClubAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Announcement
          </button>
        )}
      </div>

      {/* Announcements List */}
      {loading ? (
        <SkeletonLoader count={4} type="table" />
      ) : announcements.length === 0 ? (
        <EmptyState
          title="No active campus announcements"
          description="Check back later for university news and notices."
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((anc) => (
            <div
              key={anc._id}
              className="bg-white border border-slate-200 hover:border-slate-300 p-6 rounded-2xl flex flex-col gap-3 transition-all shadow-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={anc.priority === 'High' ? 'danger' : anc.priority === 'Medium' ? 'warning' : 'primary'}>
                    {anc.priority} Priority
                  </Badge>
                  <span className="text-xs font-semibold text-slate-500">Target: {anc.targetAudience}</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <UserCheck className="w-3.5 h-3.5 text-slate-500" /> {anc.author} • {new Date(anc.createdAt).toLocaleDateString()}
                </div>
              </div>

              <h3 className="font-bold text-base text-slate-900">{anc.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{anc.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Broadcast Campus Notice">
        <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Central Library Extended Night Hours"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Audience</label>
              <input
                type="text"
                required
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Details</label>
            <textarea
              rows="4"
              required
              placeholder="Describe the announcement details..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-xs transition-all"
            >
              {submitting ? 'Broadcasting...' : 'Broadcast Notice'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
