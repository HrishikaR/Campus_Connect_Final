import React from 'react';

export default function SkeletonLoader({ count = 3, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="w-full h-44 bg-slate-100 rounded-xl" />
            <div className="h-5 bg-slate-100 rounded-md w-3/4" />
            <div className="h-4 bg-slate-100 rounded-md w-1/2" />
            <div className="h-10 bg-slate-100 rounded-lg mt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-14 bg-white border border-slate-200 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}
