import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { UserCheck, ShieldCheck, Award } from 'lucide-react';

export default function RoleSwitcher() {
  const { user, switchRole } = useAuth();
  const { addToast } = useNotification();

  const handleRoleChange = async (role) => {
    if (user?.role === role) return;
    const ok = await switchRole(role);
    if (ok) {
      const roleTitles = {
        student: 'Student (Alex Morgan)',
        club_admin: 'Club Admin (Sarah Chen)',
        super_admin: 'Super Admin (Prof. Vance)'
      };
      addToast(`Switched active persona to ${roleTitles[role]}`, 'success');
    } else {
      addToast('Failed to switch persona mode', 'error');
    }
  };

  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-xs text-xs">
      <span className="text-slate-500 font-medium px-2 hidden lg:inline">Persona Mode:</span>
      
      <button
        id="btn-persona-student"
        onClick={() => handleRoleChange('student')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
          user?.role === 'student'
            ? 'bg-slate-900 text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Student View"
      >
        <UserCheck className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Student</span>
      </button>

      <button
        id="btn-persona-clubadmin"
        onClick={() => handleRoleChange('club_admin')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
          user?.role === 'club_admin'
            ? 'bg-purple-700 text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Club Admin View"
      >
        <Award className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Club Admin</span>
      </button>

      <button
        id="btn-persona-superadmin"
        onClick={() => handleRoleChange('super_admin')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium transition-all ${
          user?.role === 'super_admin'
            ? 'bg-emerald-700 text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title="Super Admin View"
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Super Admin</span>
      </button>
    </div>
  );
}
