import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import Badge from '../components/common/Badge.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import ResourceCard from '../components/resources/ResourceCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import {
  User,
  Calendar,
  Heart,
  Users,
  Lock,
  Edit2,
  Trash2,
  Check,
  Building2,
  Phone,
  BookOpen
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserData } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'profile' | 'favorites' | 'clubs' | 'security'
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [userClubs, setUserClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [studentId, setStudentId] = useState(user?.studentId || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setBio(user.bio || '');
      setDepartment(user.department || '');
      setStudentId(user.studentId || '');
      setAvatar(user.avatar || '');
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [bkRes, favRes, clubRes] = await Promise.all([
        API.get('/users/bookings'),
        API.get('/favorites'),
        API.get('/users/clubs')
      ]);

      if (bkRes.success) setBookings(bkRes.bookings || []);
      if (favRes.success) setFavorites(favRes.favorites || []);
      if (clubRes.success) setUserClubs(clubRes.clubs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await API.put('/users/profile', {
        name,
        phone,
        bio,
        department,
        studentId,
        avatar
      });
      if (res.success) {
        addToast('Profile updated successfully!', 'success');
        updateUserData(res.user);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      const res = await API.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      if (res.success) {
        addToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const res = await API.put(`/bookings/${bookingId}/cancel`);
      if (res.success) {
        addToast('Booking cancelled', 'success');
        fetchUserData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Profile Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-xl object-cover ring-2 ring-slate-100 shadow-xs"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl font-bold text-slate-900">{user?.name}</h1>
              <Badge variant="primary" className="uppercase text-[10px]">{user?.role?.replace('_', ' ')}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email} • ID: {user?.studentId}</p>
            <p className="text-xs text-slate-700 font-semibold mt-0.5">{user?.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-700">
          <div className="text-center px-3 border-r border-slate-200">
            <span className="font-bold text-slate-900 text-sm">{bookings.length}</span>
            <p className="text-[10px] text-slate-500">Bookings</p>
          </div>
          <div className="text-center px-3 border-r border-slate-200">
            <span className="font-bold text-slate-900 text-sm">{favorites.length}</span>
            <p className="text-[10px] text-slate-500">Favorites</p>
          </div>
          <div className="text-center px-3">
            <span className="font-bold text-slate-900 text-sm">{userClubs.length}</span>
            <p className="text-[10px] text-slate-500">Clubs</p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1 overflow-x-auto scrollbar-none shadow-xs">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'bookings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-4 h-4" /> Booking History
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'favorites'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Facilities
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <User className="w-4 h-4" /> Edit Profile
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'security'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-4 h-4" /> Security Settings
        </button>
      </div>

      {/* Tab 1: Bookings History */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900">My Facility Bookings</h3>

          {loading ? (
            <SkeletonLoader count={3} type="table" />
          ) : bookings.length === 0 ? (
            <EmptyState
              title="No bookings recorded yet"
              description="Browse library study pods, labs, or seminar halls to make your first reservation!"
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {bookings.map((b) => (
                <div key={b._id} className="py-3.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{b.resourceName}</h4>
                      <Badge variant={b.status === 'Approved' ? 'success' : b.status === 'Cancelled' ? 'danger' : 'warning'}>
                        {b.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{b.building}</p>
                    <p className="text-[11px] text-slate-700 font-medium mt-0.5">
                      📅 {b.bookingDate} • ⏰ {b.startTime} - {b.endTime}
                    </p>
                    {b.purpose && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        "{b.purpose}"
                      </p>
                    )}
                  </div>

                  {b.status === 'Approved' && (
                    <button
                      onClick={() => handleCancelBooking(b._id)}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all self-start sm:self-auto"
                    >
                      Cancel Reservation
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Favorites */}
      {activeTab === 'favorites' && (
        <div>
          {loading ? (
            <SkeletonLoader count={3} type="card" />
          ) : favorites.length === 0 ? (
            <EmptyState
              title="No saved favorite facilities"
              description="Click the heart icon on any facility card to save it here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((res) => (
                <ResourceCard key={res._id} resource={res} onBook={() => {}} isFavorite={true} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Edit Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 max-w-2xl shadow-xs">
          <h3 className="font-bold text-sm text-slate-900">Personal Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student / Staff ID</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Avatar Photo</label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                placeholder="Image URL or upload file below"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
              <label className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer border border-slate-200 shrink-0">
                Upload File
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        addToast('Uploading image...', 'info');
                        const res = await API.post('/upload', formData, {
                          headers: { 'Content-Type': 'multipart/form-data' }
                        });
                        if (res.success) {
                          setAvatar(res.url);
                          addToast('Image uploaded successfully!', 'success');
                        }
                      } catch (err) {
                        addToast(err.message || 'Upload failed', 'error');
                      }
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio</label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-all"
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 4: Security Settings */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 max-w-md shadow-xs">
          <h3 className="font-bold text-sm text-slate-900">Change Account Password</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={changingPassword}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-xs transition-all"
            >
              {changingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
