import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api.js';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import EventCard from '../components/events/EventCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Users, Shield, Calendar, ArrowLeft, Check, X, Clock, Send } from 'lucide-react';

export default function ClubDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [club, setClub] = useState(null);
  const [clubEvents, setClubEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStatement, setRequestStatement] = useState('');
  const [submittingReq, setSubmittingReq] = useState(false);

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      setLoading(true);
      const [clubRes, eventsRes] = await Promise.all([
        API.get(`/clubs/${id}`),
        API.get('/events')
      ]);

      if (clubRes.success) {
        setClub(clubRes.club);
      }
      if (eventsRes.success) {
        setClubEvents(eventsRes.events.filter(e => e.clubId === id || e.clubName === clubRes.club?.name));
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeave = async () => {
    if (!user) {
      addToast('Please sign in to manage club membership', 'warning');
      return;
    }

    const isMember = club?.members?.some(m => m.userId === user._id);
    if (isMember) {
      try {
        const res = await API.post(`/clubs/${id}/leave`);
        if (res.success) {
          addToast(res.message, 'success');
          fetchClubDetails();
        }
      } catch (err) {
        addToast(err.message, 'error');
      }
    } else {
      setShowRequestModal(true);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmittingReq(true);
    try {
      const res = await API.post(`/clubs/${id}/request`, { statement: requestStatement });
      if (res.success) {
        addToast('Membership request submitted successfully!', 'success');
        setShowRequestModal(false);
        setRequestStatement('');
        fetchClubDetails();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingReq(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const res = await API.post(`/clubs/${id}/approve`, { userId });
      if (res.success) {
        addToast('Member request approved!', 'success');
        fetchClubDetails();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleReject = async (userId) => {
    try {
      const res = await API.post(`/clubs/${id}/reject`, { userId });
      if (res.success) {
        addToast('Member request declined', 'info');
        fetchClubDetails();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  if (loading) return <SkeletonLoader count={1} type="card" />;

  if (!club) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-bold text-slate-900">Club Not Found</h2>
        <Link to="/clubs" className="text-xs text-slate-600 underline mt-2 inline-block">
          Return to Clubs Directory
        </Link>
      </div>
    );
  }

  const isMember = club.members?.some(m => m.userId === user?._id);
  const isPending = club.pendingRequests?.some(r => r.userId === user?._id);
  const isLeader = club.leaderId === user?._id || user?.role === 'super_admin';

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      <Link
        to="/clubs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Clubs Directory
      </Link>

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="relative h-48 sm:h-60 bg-slate-100">
          <img
            src={club.banner}
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge variant="purple">{club.category}</Badge>
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="p-6 -mt-12 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <img
              src={club.logo}
              alt={club.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white bg-slate-50 shadow-md"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{club.name}</h1>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-purple-600" /> Leader: {club.leaderName}</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4 text-purple-600" /> {club.members?.length || 0} Members</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleJoinLeave}
            disabled={isPending}
            className={`text-xs font-semibold px-5 py-2.5 rounded-lg transition-all shadow-xs ${
              isMember
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                : isPending
                ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isMember ? 'Leave Club' : isPending ? 'Request Pending...' : 'Apply to Join Club'}
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Description, Events, and Pending Requests */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-2">About Society</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{club.description}</p>
          </div>

          {/* Pending Requests Section for Club Leaders */}
          {isLeader && club.pendingRequests && club.pendingRequests.length > 0 && (
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-600" /> Pending Membership Applications ({club.pendingRequests.length})
              </div>

              <div className="divide-y divide-amber-200/60">
                {club.pendingRequests.map((req) => (
                  <div key={req._id} className="py-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{req.name} <span className="text-slate-500 font-normal">({req.email})</span></p>
                      <p className="text-slate-600 text-[11px] italic mt-0.5">"{req.statement}"</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleApprove(req.userId)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] px-3 py-1.5 rounded-md flex items-center gap-1 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(req.userId)}
                        className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-[11px] px-3 py-1.5 rounded-md flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-700" /> Hosted Events
            </h3>
            {clubEvents.length === 0 ? (
              <p className="text-xs text-slate-500 py-4">No events published by this club yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clubEvents.map(evt => (
                  <EventCard
                    key={evt._id}
                    event={evt}
                    onJoin={async (evtId) => {
                      try {
                        const res = await API.post(`/events/${evtId}/join`);
                        if (res.success) fetchClubDetails();
                      } catch (e) { console.error(e); }
                    }}
                    isJoined={evt.participants?.includes(user?._id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Member Roster */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-4 h-fit">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-700" /> Club Roster ({club.members?.length || 0})
          </h3>

          <div className="divide-y divide-slate-100">
            {club.members?.map((m, i) => (
              <div key={i} className="py-2.5 first:pt-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                    {m.name?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <p className="text-[10px] text-slate-500">{m.role}</p>
                  </div>
                </div>
                <Badge variant={m.role === 'President' ? 'purple' : 'default'}>{m.role}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Membership Request Modal */}
      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title={`Apply to Join: ${club.name}`}>
        <form onSubmit={handleSubmitRequest} className="flex flex-col gap-4">
          <p className="text-xs text-slate-600">
            Submit your membership statement to the club committee for review.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Statement / Why do you want to join?
            </label>
            <textarea
              rows="4"
              required
              placeholder="Tell the club leaders about your interests and motivation..."
              value={requestStatement}
              onChange={(e) => setRequestStatement(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowRequestModal(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingReq}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {submittingReq ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
