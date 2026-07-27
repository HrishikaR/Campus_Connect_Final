import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import API from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, resource, onSuccess }) {
  if (!resource) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [bookingDate, setBookingDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [purpose, setPurpose] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useNotification();

  const handleCheckAvailability = async () => {
    if (startTime >= endTime) {
      addToast('End time must be after start time', 'warning');
      return;
    }

    setIsChecking(true);
    setAvailabilityStatus(null);
    try {
      const res = await API.post('/resources/check-availability', {
        resourceId: resource._id,
        date: bookingDate,
        startTime,
        endTime
      });
      setAvailabilityStatus(res);
      if (res.available) {
        addToast('Time slot is available!', 'success');
      } else {
        addToast(res.message, 'error');
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (startTime >= endTime) {
      addToast('End time must be after start time', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await API.post('/bookings', {
        resourceId: resource._id,
        bookingDate,
        startTime,
        endTime,
        purpose
      });
      if (res.success) {
        addToast(`Slot reserved successfully! Booking ID: ${res.booking._id}`, 'success');
        if (onSuccess) onSuccess(res.booking);
        onClose();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reserve Slot: ${resource.name}`}>
      <form onSubmit={handleConfirmBooking} className="flex flex-col gap-5">
        
        {/* Resource Header Summary */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-slate-900">{resource.name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{resource.building}</p>
          </div>
          <span className="text-xs font-semibold text-slate-800 bg-white px-3 py-1 rounded-md border border-slate-200 shadow-xs">
            Cap: {resource.capacity} Seats
          </span>
        </div>

        {/* Date & Time Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Reservation Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={bookingDate}
              onChange={(e) => {
                setBookingDate(e.target.value);
                setAvailabilityStatus(null);
              }}
              required
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setAvailabilityStatus(null);
              }}
              required
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setAvailabilityStatus(null);
              }}
              required
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Availability Check Button & Badge */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={handleCheckAvailability}
            disabled={isChecking}
            className="text-xs font-semibold text-slate-800 hover:text-slate-900 flex items-center gap-1.5 underline underline-offset-4"
          >
            <Clock className="w-3.5 h-3.5" />
            {isChecking ? 'Checking conflict...' : 'Verify slot availability'}
          </button>

          {availabilityStatus && (
            <div className={`flex items-center gap-1.5 text-xs font-semibold ${
              availabilityStatus.available ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {availabilityStatus.available ? (
                <><CheckCircle2 className="w-4 h-4" /> Slot Available</>
              ) : (
                <><AlertCircle className="w-4 h-4" /> Conflict Detected</>
              )}
            </div>
          )}
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Booking Purpose / Description
          </label>
          <textarea
            rows="3"
            placeholder="e.g., Group project session, thesis research, club committee meeting..."
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
          />
        </div>

        {/* Modal Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-xs transition-all"
          >
            {submitting ? 'Confirming...' : 'Confirm Reservation'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
