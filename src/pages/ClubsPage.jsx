import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import ClubCard from '../components/clubs/ClubCard.jsx';
import CreateClubModal from '../components/clubs/CreateClubModal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { Users, Plus, Search } from 'lucide-react';

export default function ClubsPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/clubs');
      if (res.success) {
        setClubs(res.clubs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubId) => {
    if (!user) {
      addToast('Please sign in to join campus clubs', 'warning');
      return;
    }
    try {
      const res = await API.post(`/clubs/${clubId}/join`);
      if (res.success) {
        addToast(res.message, 'success');
        fetchClubs();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const filteredClubs = clubs.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-900" /> Clubs & Student Societies
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect with technical guilds, robotics chapters, arts societies, and sports teams
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) {
              addToast('Please sign in to register a club', 'warning');
              return;
            }
            setShowCreateModal(true);
          }}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Register New Club
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search clubs by name, category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-xs"
        />
      </div>

      {/* Grid */}
      {loading ? (
        <SkeletonLoader count={6} type="card" />
      ) : filteredClubs.length === 0 ? (
        <EmptyState
          title="No clubs found"
          description="Try searching for another keyword or create a new student society!"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => {
            const isJoined = club.members?.some(m => m.userId === user?._id);
            return (
              <ClubCard
                key={club._id}
                club={club}
                onJoin={handleJoinClub}
                isJoined={isJoined}
              />
            );
          })}
        </div>
      )}

      {/* Register Club Modal */}
      <CreateClubModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => fetchClubs()}
      />
    </div>
  );
}
