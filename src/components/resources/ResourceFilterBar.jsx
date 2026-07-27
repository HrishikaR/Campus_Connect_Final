import React from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';

export default function ResourceFilterBar({
  selectedCategory,
  setSelectedCategory,
  selectedBuilding,
  setSelectedBuilding,
  minCapacity,
  setMinCapacity,
  searchQuery,
  setSearchQuery,
  onReset
}) {
  const categories = ['All', 'Study Rooms', 'Computer Labs', 'Library Seats', 'Seminar Halls', 'Sports Facilities', 'Meeting Rooms', 'Auditorium'];
  const buildings = ['All', 'Main Library', 'Turing Science Complex', 'Student Activity Center', 'Business & Management Wing', 'University Sports Complex'];

  return (
    <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col gap-4 shadow-xs">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100/80 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        {/* Building */}
        <div>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          >
            <option value="All">All Campus Buildings</option>
            {buildings.filter(b => b !== 'All').map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Min Capacity */}
        <div>
          <select
            value={minCapacity}
            onChange={(e) => setMinCapacity(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          >
            <option value="">Any Capacity</option>
            <option value="1">1+ Person</option>
            <option value="5">5+ Persons</option>
            <option value="20">20+ Persons</option>
            <option value="50">50+ Persons</option>
            <option value="100">100+ Persons</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>
    </div>
  );
}
