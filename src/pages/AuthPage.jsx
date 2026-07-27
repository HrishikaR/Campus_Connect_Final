import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { GraduationCap, Lock, Mail, User, Shield, BookOpen, KeyRound } from 'lucide-react';
import API from '../services/api.js';

export default function AuthPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'signup' | 'forgot'
  const { login, signup } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup State
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('Computer Science');
  const [studentId, setStudentId] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');

  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success) {
        addToast(`Welcome back, ${res.user.name}!`, 'success');
        navigate('/');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signup({
        name,
        email: signupEmail,
        password: signupPassword,
        role,
        department,
        studentId: studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`
      });
      if (res.success) {
        addToast('Account created successfully!', 'success');
        navigate('/');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/forgot-password', { email: forgotEmail });
      addToast(res.message, 'success');
      setTab('login');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xs relative overflow-hidden">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs mb-1">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">CampusConnect Portal</h2>
          <p className="text-xs text-slate-500">Smart University Account & Single Sign-On</p>
        </div>

        {/* Auth Mode Tabs */}
        {tab !== 'forgot' && (
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mb-6">
            <button
              onClick={() => setTab('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                tab === 'signup'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">University Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setTab('forgot')}
                  className="text-[11px] text-slate-600 hover:text-slate-900 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg shadow-xs transition-all mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>

            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500 font-medium">Demo Quick Sign-In Credentials:</span>
              <p className="text-[10px] text-slate-500 mt-1">
                Student: alex.student@university.edu | Password: password123
              </p>
            </div>
          </form>
        )}

        {/* Signup Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">University Email</label>
              <input
                type="email"
                required
                placeholder="name@university.edu"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="student">Student</option>
                  <option value="club_admin">Club Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Student / Staff ID</label>
              <input
                type="text"
                placeholder="e.g. CS-2026-1029"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="At least 6 characters"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg shadow-xs transition-all mt-2"
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {tab === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <p className="text-xs text-slate-500">
              Enter your registered university email to receive password reset instructions.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">University Email</label>
              <input
                type="email"
                required
                placeholder="student@university.edu"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg transition-all"
            >
              {loading ? 'Sending Request...' : 'Send Password Reset Email'}
            </button>

            <button
              type="button"
              onClick={() => setTab('login')}
              className="w-full text-xs text-slate-500 hover:text-slate-900 text-center mt-2"
            >
              Back to Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
