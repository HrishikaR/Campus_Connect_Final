import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import Badge from '../components/common/Badge.jsx';
import Modal from '../components/common/Modal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  ShieldCheck,
  Users,
  Building2,
  Calendar,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Plus,
  TrendingUp
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics' | 'users' | 'resources' | 'bookings'
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [resourcesList, setResourcesList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Resource Modal State
  const [showAddResource, setShowAddResource] = useState(false);
  const [resName, setResName] = useState('');
  const [resType, setResType] = useState('Study Rooms');
  const [resBuilding, setResBuilding] = useState('Main Library - 1st Floor');
  const [resCapacity, setResCapacity] = useState('10');
  const [resDescription, setResDescription] = useState('');
  const [resImage, setResImage] = useState('');
  const [submittingResource, setSubmittingResource] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [anData, uData, rData, bData] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/admin/users'),
        API.get('/resources'),
        API.get('/bookings/all')
      ]);

      if (anData.success) setAnalytics(anData.analytics);
      if (uData.success) setUsersList(uData.users);
      if (rData.success) setResourcesList(rData.resources);
      if (bData.success) setBookingsList(bData.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await API.put(`/admin/users/${userId}/role`, { role: newRole });
      if (res.success) {
        addToast(res.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this user account?')) return;
    try {
      const res = await API.delete(`/admin/users/${userId}`);
      if (res.success) {
        addToast(res.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleCreateResource = async (e) => {
    e.preventDefault();
    setSubmittingResource(true);
    try {
      const res = await API.post('/resources', {
        name: resName,
        type: resType,
        building: resBuilding,
        capacity: Number(resCapacity),
        description: resDescription,
        image: resImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
      });
      if (res.success) {
        addToast('Resource facility added!', 'success');
        setShowAddResource(false);
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmittingResource(false);
    }
  };

  const handleBookingStatus = async (bookingId, status) => {
    try {
      const res = await API.put(`/bookings/${bookingId}/status`, { status });
      if (res.success) {
        addToast(res.message, 'success');
        fetchAdminData();
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Super Admin Control Panel</h1>
            <p className="text-xs text-slate-500 mt-0.5">System-wide analytics, facility management & role permissions</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddResource(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-xs transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Campus Facility
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1 overflow-x-auto scrollbar-none shadow-xs">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'analytics' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          📈 System Analytics
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'users' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          👥 User Accounts ({usersList.length})
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'resources' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          🏛️ Facilities ({resourcesList.length})
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'bookings' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          📅 All Reservations ({bookingsList.length})
        </button>
      </div>

      {/* Tab 1: System Analytics */}
      {activeTab === 'analytics' && (
        <div className="flex flex-col gap-6">
          
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Registered Users</span>
              <span className="text-2xl font-black text-slate-900">{analytics?.totalUsers || 0}</span>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Active Facilities</span>
              <span className="text-2xl font-black text-slate-900">{analytics?.totalResources || 0}</span>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Total Slot Reservations</span>
              <span className="text-2xl font-black text-slate-900">{analytics?.totalBookings || 0}</span>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-1 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">Campus Clubs</span>
              <span className="text-2xl font-black text-slate-900">{analytics?.activeClubs || 0}</span>
            </div>
          </div>

          {/* Recharts Data Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Bar Chart: Monthly Booking Trends */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col gap-4 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900">Monthly Booking Volume Trends</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.monthlyBookingStats || []}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                      itemStyle={{ color: '#0f172a', fontSize: '12px' }}
                    />
                    <Bar dataKey="bookings" fill="#0f172a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart: Resource Usage Distribution */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col gap-4 shadow-xs">
              <h3 className="font-bold text-sm text-slate-900">Resource Facility Category Usage</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics?.resourceUsage || []}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics?.resourceUsage?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                      itemStyle={{ color: '#0f172a', fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management Table */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-6 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-4">University User Accounts</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Department & ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80">
                    <td className="p-3 flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <p className="font-semibold text-slate-900">{u.name}</p>
                        <p className="text-[10px] text-slate-500">{u.email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="text-slate-800">{u.department || 'N/A'}</p>
                      <p className="text-[10px] text-slate-500">{u.studentId}</p>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-slate-900"
                      >
                        <option value="student">Student</option>
                        <option value="club_admin">Club Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Facilities Management */}
      {activeTab === 'resources' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-slate-900">Campus Facilities List</h3>
            <button
              onClick={() => setShowAddResource(true)}
              className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-all"
            >
              + New Facility
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {resourcesList.map((res) => (
              <div key={res._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img src={res.image} alt={res.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                  <div>
                    <p className="font-bold text-slate-900">{res.name}</p>
                    <p className="text-slate-500">{res.building} • Cap: {res.capacity}</p>
                  </div>
                </div>
                <Badge variant="primary">{res.type}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: All Bookings Control */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h3 className="font-bold text-sm text-slate-900 mb-4">Master Slot Reservations</h3>

          <div className="divide-y divide-slate-100">
            {bookingsList.map((b) => (
              <div key={b._id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{b.resourceName}</span>
                    <Badge variant={b.status === 'Approved' ? 'success' : b.status === 'Cancelled' ? 'danger' : 'warning'}>
                      {b.status}
                    </Badge>
                  </div>
                  <p className="text-slate-500 mt-0.5">User: {b.userName} ({b.userEmail})</p>
                  <p className="text-slate-700 font-medium text-[11px]">📅 {b.bookingDate} ({b.startTime} - {b.endTime})</p>
                </div>

                <div className="flex items-center gap-2">
                  {b.status !== 'Approved' && (
                    <button
                      onClick={() => handleBookingStatus(b._id, 'Approved')}
                      className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                      title="Approve Reservation"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  {b.status !== 'Cancelled' && (
                    <button
                      onClick={() => handleBookingStatus(b._id, 'Cancelled')}
                      className="p-1.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                      title="Cancel Reservation"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Resource Modal */}
      <Modal isOpen={showAddResource} onClose={() => setShowAddResource(false)} title="Add Campus Facility">
        <form onSubmit={handleCreateResource} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Name</label>
            <input
              type="text"
              required
              placeholder="e.g., Robotics Prototyping Workshop"
              value={resName}
              onChange={(e) => setResName(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Type</label>
              <select
                value={resType}
                onChange={(e) => setResType(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              >
                <option value="Study Rooms">Study Rooms</option>
                <option value="Computer Labs">Computer Labs</option>
                <option value="Library Seats">Library Seats</option>
                <option value="Seminar Halls">Seminar Halls</option>
                <option value="Sports Facilities">Sports Facilities</option>
                <option value="Meeting Rooms">Meeting Rooms</option>
                <option value="Auditorium">Auditorium</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity</label>
              <input
                type="number"
                required
                value={resCapacity}
                onChange={(e) => setResCapacity(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Building Location</label>
            <input
              type="text"
              required
              value={resBuilding}
              onChange={(e) => setResBuilding(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows="3"
              required
              value={resDescription}
              onChange={(e) => setResDescription(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddResource(false)}
              className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingResource}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-xs transition-all"
            >
              {submittingResource ? 'Adding...' : 'Add Facility'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
