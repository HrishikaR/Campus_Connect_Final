import React, { useState, useEffect } from 'react';
import API from '../services/api.js';
import Badge from '../components/common/Badge.jsx';
import BookingModal from '../components/resources/BookingModal.jsx';
import SkeletonLoader from '../components/common/SkeletonLoader.jsx';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNotification } from '../context/NotificationContext.jsx';

export default function BookingCalendarPage() {
  const [resources, setResources] = useState([]);
  const [selectedResourceId, setSelectedResourceId] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResourceForModal, setSelectedResourceForModal] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const { addToast } = useNotification();

  // Selected date state for weekly grid view
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resData, bkData] = await Promise.all([
        API.get('/resources'),
        API.get('/admin/bookings').catch(() => API.get('/users/bookings'))
      ]);

      if (resData.success) setResources(resData.resources || []);
      if (bkData.success) setBookings(bkData.bookings || []);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Generate 7 days of current week
  const getWeekDays = (baseDate) => {
    const days = [];
    const start = new Date(baseDate);
    const dayOfWeek = start.getDay();
    // Get Monday of week
    const diffToMonday = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(start.setDate(diffToMonday));

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);

  const formatISO = (d) => d.toISOString().split('T')[0];

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const filteredBookings = bookings.filter(b => {
    if (b.status === 'Cancelled') return false;
    if (selectedResourceId !== 'all' && b.resourceId !== selectedResourceId) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-slate-700" /> Facility Booking Calendar
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Visual schedule of reserved slots and real-time facility availability across campus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedResourceId}
            onChange={(e) => setSelectedResourceId(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-800 focus:outline-none focus:border-slate-900"
          >
            <option value="all">All Facilities</option>
            {resources.map(r => (
              <option key={r._id} value={r._id}>{r.name} ({r.building})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-xs">
        <button
          onClick={handlePrevWeek}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Week
        </button>

        <span className="font-bold text-xs text-slate-900 uppercase tracking-wide">
          Week of {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>

        <button
          onClick={handleNextWeek}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-700 transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          Next Week <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekly Grid Calendar View */}
      {loading ? (
        <SkeletonLoader count={1} type="card" />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-bold text-slate-700">
            {weekDays.map((d, i) => {
              const isToday = formatISO(d) === formatISO(new Date());
              return (
                <div key={i} className={`py-3 px-1 border-r last:border-r-0 border-slate-200 ${isToday ? 'bg-slate-900 text-white' : ''}`}>
                  <p className="text-[10px] uppercase font-semibold text-slate-400">{d.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="text-sm font-bold mt-0.5">{d.getDate()}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[360px]">
            {weekDays.map((d, dayIdx) => {
              const dayStr = formatISO(d);
              const dayBookings = filteredBookings.filter(b => b.bookingDate === dayStr);

              return (
                <div key={dayIdx} className="p-2 flex flex-col gap-2 hover:bg-slate-50/50 transition-colors">
                  {dayBookings.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-2 text-center text-[10px] text-slate-400">
                      <span>No reservations</span>
                    </div>
                  ) : (
                    dayBookings.map((b) => (
                      <div
                        key={b._id}
                        className="bg-slate-900 text-white border border-slate-800 p-2 rounded-xl text-[10px] shadow-xs hover:scale-[1.02] transition-all"
                      >
                        <p className="font-bold truncate text-slate-100">{b.resourceName}</p>
                        <p className="text-slate-300 font-semibold mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-400" /> {b.startTime} - {b.endTime}
                        </p>
                        <p className="text-slate-400 truncate mt-0.5">{b.userName || 'Student'}</p>
                      </div>
                    ))
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Facilities Quick Reserve Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900">Select Facility to Book</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((res) => (
            <div
              key={res._id}
              className="border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-3 hover:border-slate-900 transition-all bg-slate-50/50"
            >
              <div>
                <p className="font-bold text-xs text-slate-900">{res.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{res.building} • Cap: {res.capacity}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedResourceForModal(res);
                  setShowBookingModal(true);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Book
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedResourceForModal && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          resource={selectedResourceForModal}
          onSuccess={() => fetchData()}
        />
      )}
    </div>
  );
}
