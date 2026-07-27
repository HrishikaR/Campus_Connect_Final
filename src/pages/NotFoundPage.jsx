import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
        <GraduationCap className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-100 mb-2">404</h1>
      <h2 className="text-lg font-bold text-slate-300 mb-2">Campus Page Not Found</h2>
      <p className="text-xs text-slate-400 max-w-sm mb-6">
        The requested resource path or campus portal page does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Return to CampusConnect Home
      </Link>
    </div>
  );
}
