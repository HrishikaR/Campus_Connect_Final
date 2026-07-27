import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search filters or check back later.',
  actionLabel,
  onAction,
  icon: Icon = FolderOpen
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border border-slate-200 rounded-2xl gap-3 my-6 shadow-xs">
      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
        <Icon className="w-6 h-6" />
      </div>
      <div className="max-w-md">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
