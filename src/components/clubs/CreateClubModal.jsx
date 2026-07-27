import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import API from '../../services/api.js';
import { useNotification } from '../../context/NotificationContext.jsx';

export default function CreateClubModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Technology');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');
  const [loading, setLoading] = useState(false);

  const { addToast } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/clubs', {
        name,
        category,
        description,
        logo: logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
        banner: banner || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80'
      });
      if (res.success) {
        addToast('Club created successfully!', 'success');
        if (onSuccess) onSuccess(res.club);
        onClose();
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Register New Campus Society / Club">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Club Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Quantum Computing Student Chapter"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          >
            <option value="Technology">Technology & Software</option>
            <option value="Engineering">Robotics & Engineering</option>
            <option value="Arts">Arts & Cultural</option>
            <option value="Sports">Sports & Athletics</option>
            <option value="Business">Entrepreneurship & Finance</option>
            <option value="Social">Social & Community Service</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description & Purpose
          </label>
          <textarea
            rows="3"
            required
            placeholder="Outline the mission, activities, and goals of the society..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Logo Image URL (Optional)
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
          />
        </div>

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
            disabled={loading}
            className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-5 py-2 rounded-lg shadow-xs transition-all"
          >
            {loading ? 'Registering...' : 'Register Club'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
