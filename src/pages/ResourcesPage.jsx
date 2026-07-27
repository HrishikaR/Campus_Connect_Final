import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api.js';
import ResourceFilterBar from '../components/resources/ResourceFilterBar.jsx';
import ResourceCard from '../components/resources/ResourceCard.jsx';
import BookingModal from '../components/resources/BookingModal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Building2, Plus } from 'lucide-react';

export default function ResourcesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [minCapacity, setMinCapacity] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const [bookingResource, setBookingResource] = useState(null);

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedBuilding, minCapacity, searchQuery]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedCategory !== 'All') queryParams.set('category', selectedCategory);
      if (selectedBuilding !== 'All') queryParams.set('building', selectedBuilding);
      if (minCapacity) queryParams.set('minCapacity', minCapacity);
      if (searchQuery) queryParams.set('search', searchQuery);

      const res = await API.get(`/resources?${queryParams.toString()}`);
      if (res.success) {
        setResources(res.resources);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSelectedBuilding('All');
    setMinCapacity('');
    setSearchQuery('');
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-900" /> Campus Facilities & Study Spaces
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse and reserve quiet study pods, computing labs, library seats, and auditoriums
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <ResourceFilterBar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedBuilding={selectedBuilding}
        setSelectedBuilding={setSelectedBuilding}
        minCapacity={minCapacity}
        setMinCapacity={setMinCapacity}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onReset={handleResetFilters}
      />

      {/* Grid Content */}
      {loading ? (
        <SkeletonLoader count={6} type="card" />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No campus facilities match your filters"
          description="Try broadening your capacity range or clearing category filters."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res) => (
            <ResourceCard
              key={res._id}
              resource={res}
              onBook={(resource) => setBookingResource(resource)}
              isFavorite={user?.favorites?.includes(res._id)}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={!!bookingResource}
        onClose={() => setBookingResource(null)}
        resource={bookingResource}
        onSuccess={() => fetchResources()}
      />
    </div>
  );
}
