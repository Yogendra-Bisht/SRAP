'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, SlidersHorizontal, MapPin, X } from 'lucide-react';
import RoomCard from '../components/RoomCard';
import api from '../lib/api';

const ROOM_TYPES = ['Single', 'Double', 'Triple', 'Dormitory', 'Studio'];
const GENDERS    = ['Any', 'Male', 'Female'];

export default function RoomsPage() {
  const [rooms,       setRooms]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total,      setTotal]      = useState(0);

  // Filters
  const [filters, setFilters] = useState({
    city: '', minPrice: '', maxPrice: '', roomType: '', gender: '',
  });

  const fetchRooms = async (activeFilters, pageNum = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      Object.entries(activeFilters).forEach(([k, v]) => { if (v) params.append(k, v); });
      params.append('page',  pageNum);
      params.append('limit', 12);
      const res = await api.get(`/rooms?${params.toString()}`);
      setRooms(res.data.rooms);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(filters); }, []); // eslint-disable-line

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSearch = (e) => { e.preventDefault(); fetchRooms(filters, 1); };

  const handleReset = () => {
    const cleared = { city: '', minPrice: '', maxPrice: '', roomType: '', gender: '' };
    setFilters(cleared);
    fetchRooms(cleared, 1);
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header Banner ── */}
      <div className="pt-28 pb-10 px-6 bg-gradient-to-br from-teal-600 to-emerald-600 text-white text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-black mb-3"
        >
          Find Your Perfect <span className="text-teal-200">Room</span>
        </motion.h1>
        <p className="text-teal-100 font-medium">
          {loading ? 'Loading...' : `${total} verified listings available`}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto flex gap-3">
          <div className="flex-1 flex items-center gap-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-5 py-3">
            <MapPin size={18} className="text-teal-200 shrink-0" />
            <input
              id="city-search"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Search by city..."
              className="bg-transparent outline-none text-white placeholder:text-teal-200 font-semibold w-full"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-white text-teal-700 px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg"
          >
            <Search size={18} /> Search
          </motion.button>
        </form>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8">

        {/* ── Filter Sidebar ── */}
        <aside className="w-full md:w-64 shrink-0">
          <button
            onClick={() => setShowFilters((p) => !p)}
            className="md:hidden w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow border border-slate-100 font-bold text-slate-700 mb-4"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-teal-600" />
              Filters {hasActiveFilters && <span className="w-2 h-2 bg-teal-500 rounded-full" />}
            </span>
            <X size={18} className={showFilters ? '' : 'rotate-45'} />
          </button>

          <form
            onSubmit={handleSearch}
            className="hidden md:block p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-xl space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-black text-slate-800">
                <Filter size={18} className="text-teal-600" /> FILTERS
              </span>
              {hasActiveFilters && (
                <button type="button" onClick={handleReset} className="text-xs text-red-400 font-bold hover:text-red-600">
                  Reset
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Price Range (₹/mo)</label>
              <input id="filter-min-price" type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange}
                placeholder="Min price"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-300" />
              <input id="filter-max-price" type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange}
                placeholder="Max price"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-300" />
            </div>

            {/* Room Type */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Room Type</label>
              <select id="filter-room-type" name="roomType" value={filters.roomType} onChange={handleFilterChange}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-300">
                <option value="">Any Type</option>
                {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Gender Preference</label>
              <div className="flex flex-wrap gap-2">
                {GENDERS.map((g) => (
                  <button key={g} type="button"
                    onClick={() => setFilters((p) => ({ ...p, gender: p.gender === g ? '' : g }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition ${
                      filters.gender === g
                        ? 'bg-teal-500 text-white border-teal-500'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.97 }} type="submit"
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-xl font-black shadow-lg">
              Apply Filters
            </motion.button>
          </form>
        </aside>

        {/* ── Room Grid ── */}
        <div className="flex-1">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-semibold text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow border border-slate-100 animate-pulse">
                  <div className="h-48 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                    <div className="h-4 bg-slate-200 rounded w-1/3 mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-black text-slate-700 mb-2">No Rooms Found</h3>
              <p className="text-slate-500 font-medium mb-6">
                {hasActiveFilters ? 'Try adjusting your filters.' : 'No listings yet — be the first to add one!'}
              </p>
              {hasActiveFilters && (
                <button onClick={handleReset} className="text-teal-600 font-bold hover:underline">
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room, i) => (
                  <motion.div
                    key={room._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <RoomCard room={room} />
                  </motion.div>
                ))}
              </motion.div>

              {/* ── Pagination ── */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchRooms(filters, page - 1)}
                    disabled={page === 1}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    ← Prev
                  </motion.button>
                  <span className="text-sm font-bold text-slate-500">
                    Page <span className="text-teal-600">{page}</span> of {totalPages}
                    <span className="ml-2 text-slate-400">({total} listings)</span>
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fetchRooms(filters, page + 1)}
                    disabled={page === totalPages}
                    className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 font-bold text-slate-700 shadow hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next →
                  </motion.button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}