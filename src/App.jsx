import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';

import Navbar from './components/common/Navbar.jsx';
import Sidebar from './components/common/Sidebar.jsx';
import Footer from './components/common/Footer.jsx';
import RoleSwitcher from './components/common/RoleSwitcher.jsx';

import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ResourcesPage from './pages/ResourcesPage.jsx';
import ResourceDetailPage from './pages/ResourceDetailPage.jsx';
import ClubsPage from './pages/ClubsPage.jsx';
import ClubDetailPage from './pages/ClubDetailPage.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetailPage from './pages/EventDetailPage.jsx';
import AnnouncementsPage from './pages/AnnouncementsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import BookingCalendarPage from './pages/BookingCalendarPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  if (requiredRole === 'super_admin' && user.role !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-slate-900 selection:text-white">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">
        {/* Collapsible Mobile & Desktop Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Core Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/resources/:id" element={<ResourceDetailPage />} />
            
            <Route path="/clubs" element={<ClubsPage />} />
            <Route path="/clubs/:id" element={<ClubDetailPage />} />
            
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/calendar" element={<BookingCalendarPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {/* Floating Role Switcher for instant testing */}
      <RoleSwitcher />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainLayout />
      </NotificationProvider>
    </AuthProvider>
  );
}
