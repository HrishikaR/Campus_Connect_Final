import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import { Users, Shield, ArrowRight } from 'lucide-react';

export default function ClubCard({ club, onJoin, isJoined = false }) {
  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col">
      
      {/* Banner & Logo */}
      <div className="relative h-32 bg-slate-100 overflow-hidden">
        <img
          src={club.banner}
          alt={club.name}
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
        
        <div className="absolute -bottom-5 left-5">
          <img
            src={club.logo}
            alt={club.name}
            className="w-14 h-14 rounded-xl object-cover ring-4 ring-white shadow-md bg-white"
          />
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant="purple">{club.category}</Badge>
        </div>
      </div>

      {/* Body */}
      <div className="pt-8 p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 hover:text-slate-700 transition-colors line-clamp-1">
            {club.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Leader: {club.leaderName}</span>
          </div>

          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {club.description}
          </p>
        </div>

        {/* Footer info & actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{club.members?.length || 0} Members</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/clubs/${club._id}`}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1"
            >
              View <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => onJoin(club._id)}
              disabled={isJoined}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all ${
                isJoined
                  ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-default'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              }`}
            >
              {isJoined ? 'Member' : 'Join Club'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
