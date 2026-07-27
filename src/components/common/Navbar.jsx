import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import RoleSwitcher from './RoleSwitcher.jsx';
import API from '../../services/api.js';
import {
  GraduationCap,
  Search,
  Bell,
  User,
  LogOut,
  Calendar,
  Building2,
  Users,
  Megaphone,
  Shield,
  Check,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, user]);

  const fetchNotifications = async () => {
    try {
      const data = await API.get('/notifications');
      if (data.success) {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      // quiet catch
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/resources?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link id="nav-logo" to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold shadow-sm group-hover:bg-slate-800 transition-colors">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-900 tracking-tight">
                CampusConnect
              </span>
              <span className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">
                Smart University Platform
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              placeholder="Search study rooms, labs, clubs, events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
            />
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Quick Demo Persona Switcher */}
            <RoleSwitcher />

            {isAuthenticated ? (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    id="btn-notifications-toggle"
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-900">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif._id}
                              className={`p-3.5 text-xs transition-colors ${
                                notif.isRead ? 'bg-white text-slate-500' : 'bg-slate-50/80 text-slate-900 font-medium'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-semibold text-slate-900">{notif.title}</span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    id="btn-user-menu-toggle"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/80 transition-all"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={user?.name}
                      className="w-6 h-6 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                      {user?.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {user?.role?.replace('_', ' ')}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-500" /> My Profile & Bookings
                      </Link>

                      {user?.role === 'super_admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                        >
                          <Shield className="w-4 h-4 text-emerald-600" /> Admin Control Panel
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
