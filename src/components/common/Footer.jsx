import React from 'react';
import { GraduationCap, Heart, Shield, Server } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-auto py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
            CC
          </div>
          <span className="font-semibold text-slate-900">CampusConnect</span>
          <span>— Smart University Collaboration & Resource Platform</span>
        </div>

        <div className="flex items-center gap-6 text-slate-600">
          <span className="flex items-center gap-1">
            <Server className="w-3.5 h-3.5 text-emerald-600" /> Full MERN REST API
          </span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-700" /> Role-Based JWT Auth
          </span>
        </div>

        <div className="text-slate-400">
          © {new Date().getFullYear()} CampusConnect. Production Ready Architecture.
        </div>
      </div>
    </footer>
  );
}
