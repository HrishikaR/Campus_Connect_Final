import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Megaphone,
  User,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const { user, isSuperAdmin } = useAuth();

  const navItems = [
    { to: '/', label: 'Overview', icon: LayoutDashboard },
    { to: '/resources', label: 'Campus Facilities', icon: Building2 },
    { to: '/calendar', label: 'Booking Calendar', icon: Calendar },
    { to: '/clubs', label: 'Clubs & Societies', icon: Users },
    { to: '/events', label: 'Campus Events', icon: Calendar },
    { to: '/announcements', label: 'Announcements', icon: Megaphone },
    { to: '/profile', label: 'My Profile & Bookings', icon: User }
  ];

  if (isSuperAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Control Panel', icon: ShieldCheck, badge: 'Admin' });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 p-4 hidden md:flex flex-col gap-6 min-h-[calc(100vh-4rem)] shrink-0">
      
      {/* User Mini Profile Card */}
      <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-2xl flex items-center gap-3 shadow-xs">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
          alt={user?.name}
          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-200"
        />
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-xs text-slate-900 truncate">{user?.name || 'Guest Student'}</span>
          <span className="text-[10px] text-slate-500 capitalize truncate font-medium">
            {user?.department || 'University Member'}
          </span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 mb-1">
          Main Navigation
        </span>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Helpful Hint Card */}
      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-700 flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-slate-900">
          <Sparkles className="w-3.5 h-3.5 text-slate-700" /> Instant Slot Reservation
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Book study rooms or computer labs with automated real-time conflict checking.
        </p>
      </div>
    </aside>
  );
}
