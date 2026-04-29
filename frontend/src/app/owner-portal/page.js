'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusCircle, List, BarChart3, Trash2, LogIn,
  MapPin, Home, Wifi, Wind, Car, Droplets,
  ChefHat, Zap, Camera, Dumbbell, Shield, CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';

// ── Constants ─────────────────────────────────────────────────────────────────
const ROOM_TYPES  = ['Single', 'Double', 'Triple', 'Dormitory', 'Studio'];
const GENDERS     = ['Any', 'Male', 'Female'];
const AMENITY_LIST = [
  { label: 'WiFi',         icon: <Wifi size={14} /> },
  { label: 'AC',           icon: <Wind size={14} /> },
  { label: 'Laundry',      icon: <Droplets size={14} /> },
  { label: 'Parking',      icon: <Car size={14} /> },
  { label: 'Meals',        icon: <ChefHat size={14} /> },
  { label: 'Hot Water',    icon: <Droplets size={14} /> },
  { label: 'Power Backup', icon: <Zap size={14} /> },
  { label: 'CCTV',         icon: <Camera size={14} /> },
  { label: 'Gym',          icon: <Dumbbell size={14} /> },
];

const EMPTY_FORM = {
  title: '', description: '', price: '',
  roomType: 'Single', gender: 'Any',
  availableFrom: '',
  address: '', city: '', state: '', pincode: '',
  amenities: [],
  images: '',       // comma-separated URLs for now
};

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function OwnerPortal() {
  const { user, loading } = useAuth();
  const router            = useRouter();
  const [tab, setTab]     = useState('dashboard'); // 'dashboard' | 'add'

  const [myRooms,      setMyRooms]      = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [saving,  setSaving]  = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formErr, setFormErr] = useState('');

  // Redirect non-landlords
  useEffect(() => {
    if (!loading && !user)              router.push('/login');
    if (!loading && user?.role !== 'landlord') router.push('/');
  }, [user, loading, router]);

  const fetchMyRooms = useCallback(async () => {
    setRoomsLoading(true);
    try {
      // Fetch all rooms then filter by owner on client (simple approach)
      const res = await api.get('/rooms');
      const mine = res.data.rooms.filter(
        (r) => r.owner?._id === user?._id || r.owner === user?._id
      );
      setMyRooms(mine);
    } catch { /* silent */ }
    finally { setRoomsLoading(false); }
  }, [user]);

  useEffect(() => {
    if (user) fetchMyRooms();
  }, [user, fetchMyRooms]);

  // ── Form handlers ──────────────────────────────────────────────────────────
  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleAmenity = (a) =>
    setForm((p) => ({
      ...p,
      amenities: p.amenities.includes(a)
        ? p.amenities.filter((x) => x !== a)
        : [...p.amenities, a],
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErr('');
    setSaving(true);
    try {
      const payload = {
        title:       form.title,
        description: form.description,
        price:       Number(form.price),
        roomType:    form.roomType,
        gender:      form.gender,
        availableFrom: form.availableFrom,
        location: {
          address: form.address,
          city:    form.city,
          state:   form.state,
          pincode: form.pincode,
        },
        amenities: form.amenities,
        images: form.images ? form.images.split(',').map((u) => u.trim()).filter(Boolean) : [],
      };
      await api.post('/rooms', payload);
      setSuccess(true);
      setForm(EMPTY_FORM);
      fetchMyRooms();
      setTimeout(() => { setSuccess(false); setTab('dashboard'); }, 2000);
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Could not create listing. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (files.length > 5) {
      setFormErr('You can only upload a maximum of 5 images');
      return;
    }

    setUploadingImages(true);
    setFormErr('');

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Append new URLs as a comma-separated string for simplicity
      const newUrls = res.data.urls.join(',');
      setForm((prev) => ({
        ...prev,
        images: prev.images ? prev.images + ',' + newUrls : newUrls,
      }));
    } catch (err) {
      setFormErr(err.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
      // clear the file input
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const imgArray = form.images.split(',').map(u => u.trim()).filter(Boolean);
    imgArray.splice(index, 1);
    setForm(prev => ({ ...prev, images: imgArray.join(',') }));
  };

  const handleDelete = async (roomId) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      setMyRooms((p) => p.filter((r) => r._id !== roomId));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  // ── Guard ──────────────────────────────────────────────────────────────────
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  if (user.role !== 'landlord') return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="pt-28 pb-10 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/20 blur-[100px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-teal-400 font-bold text-sm uppercase tracking-widest mb-1">Owner Portal</p>
          <h1 className="text-4xl font-black mb-2">
            Welcome, <span className="text-teal-400">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-slate-400 font-medium">Manage your listings and connect with students.</p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Active Listings',   value: myRooms.filter((r) => r.isAvailable).length, icon: <List size={20} /> },
              { label: 'Total Listings',    value: myRooms.length,                               icon: <Home size={20} /> },
              { label: 'Booked Rooms',      value: myRooms.filter((r) => !r.isAvailable).length, icon: <BarChart3 size={20} /> },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur border border-white/10 p-5 rounded-2xl flex items-center gap-4">
                <div className="text-teal-400">{s.icon}</div>
                <div>
                  <p className="text-2xl font-black">{s.value}</p>
                  <p className="text-xs text-slate-400 font-semibold">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-3 mt-8">
            {[
              { key: 'dashboard', label: '📋 My Listings' },
              { key: 'add',       label: '➕ Add New Room' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-6 py-3 rounded-xl font-black text-sm transition ${
                  tab === t.key
                    ? 'bg-teal-500 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <AnimatePresence mode="wait">

          {/* ── Dashboard Tab ── */}
          {tab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {roomsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-6 shadow animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-slate-100 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : myRooms.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🏠</div>
                  <h3 className="text-2xl font-black text-slate-700 mb-2">No listings yet</h3>
                  <p className="text-slate-500 font-medium mb-6">Add your first room to start getting bookings.</p>
                  <button
                    onClick={() => setTab('add')}
                    className="bg-teal-500 text-white px-8 py-3 rounded-xl font-black shadow-lg hover:bg-teal-600 transition"
                  >
                    Add First Listing
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {myRooms.map((room, i) => (
                    <motion.div
                      key={room._id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white rounded-2xl p-6 shadow border border-slate-100 flex flex-col gap-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-slate-800 text-lg line-clamp-1">{room.title}</h3>
                          <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                            <MapPin size={13} className="text-teal-500 shrink-0" />
                            {room.location?.city}
                          </p>
                        </div>
                        <span className={`ml-3 shrink-0 px-3 py-1 rounded-full text-xs font-black ${
                          room.isAvailable
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {room.isAvailable ? 'Available' : 'Booked'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div>
                          <span className="text-xl font-black text-teal-600">
                            ₹{room.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">/mo · {room.roomType}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/room/${room._id}`}>
                            <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg font-bold transition">
                              View
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(room._id)}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-500 px-3 py-2 rounded-lg font-bold flex items-center gap-1 transition"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── Add Listing Tab ── */}
          {tab === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
            >
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center"
                >
                  <CheckCircle size={64} className="text-teal-500 mb-4" />
                  <h3 className="text-3xl font-black text-slate-800 mb-2">Listing Created!</h3>
                  <p className="text-slate-500 font-medium">Redirecting to your dashboard...</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow border border-slate-100 space-y-8">
                  <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <PlusCircle className="text-teal-500" /> New Room Listing
                  </h2>

                  {formErr && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
                      {formErr}
                    </div>
                  )}

                  {/* ── Basic Info ── */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
                      Basic Info
                    </h3>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">Room Title *</label>
                      <input id="room-title" name="title" value={form.title} onChange={handleChange} required
                        placeholder="e.g. Cozy Studio Near North Gate"
                        className="input-field" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">Description *</label>
                      <textarea id="room-desc" name="description" value={form.description} onChange={handleChange} required
                        rows={4} placeholder="Describe the room, rules, nearby landmarks..."
                        className="input-field resize-none" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">Price / Month (₹) *</label>
                        <input id="room-price" name="price" type="number" value={form.price} onChange={handleChange} required min="0"
                          placeholder="e.g. 8500" className="input-field" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">Room Type *</label>
                        <select id="room-type" name="roomType" value={form.roomType} onChange={handleChange} className="input-field">
                          {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">Gender Preference</label>
                        <select id="room-gender" name="gender" value={form.gender} onChange={handleChange} className="input-field">
                          {GENDERS.map((g) => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">Available From *</label>
                      <input id="room-available" name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} required
                        min={new Date().toISOString().split('T')[0]} className="input-field" />
                    </div>
                  </section>

                  {/* ── Location ── */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
                      Location
                    </h3>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1.5">Street Address *</label>
                      <input id="room-address" name="address" value={form.address} onChange={handleChange} required
                        placeholder="e.g. 12, College Road" className="input-field" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">City *</label>
                        <input id="room-city" name="city" value={form.city} onChange={handleChange} required
                          placeholder="e.g. Delhi" className="input-field" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">State</label>
                        <input id="room-state" name="state" value={form.state} onChange={handleChange}
                          placeholder="e.g. Delhi" className="input-field" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1.5">Pincode</label>
                        <input id="room-pincode" name="pincode" value={form.pincode} onChange={handleChange}
                          placeholder="e.g. 110001" className="input-field" />
                      </div>
                    </div>
                  </section>

                  {/* ── Amenities ── */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {AMENITY_LIST.map(({ label, icon }) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleAmenity(label)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition ${
                            form.amenities.includes(label)
                              ? 'bg-teal-500 text-white border-teal-500 shadow'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-teal-300'
                          }`}
                        >
                          {icon} {label}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* ── Images ── */}
                  <section className="space-y-4">
                    <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">
                      Images (Max 5)
                    </h3>
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <input
                          id="room-images-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={uploadingImages}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />
                        <div className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center transition-colors ${
                          uploadingImages ? 'border-slate-300 bg-slate-50' : 'border-teal-300 bg-teal-50 hover:bg-teal-100'
                        }`}>
                          {uploadingImages ? (
                            <span className="animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent" />
                          ) : (
                            <>
                              <Camera size={32} className="text-teal-500 mb-2" />
                              <p className="text-sm font-bold text-slate-700">Click or drag files here to upload</p>
                              <p className="text-xs text-slate-500 mt-1">PNG, JPG, WEBP up to 5MB each</p>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Previews */}
                      {form.images && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                          {form.images.split(',').map((u) => u.trim()).filter(Boolean).map((url, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-sm group">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={url} alt={`Preview ${i}`} className="object-cover w-full h-full" />
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute top-1 right-1 bg-white/90 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </section>

                  {/* ── Submit ── */}
                  <motion.button
                    id="create-listing-btn"
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.02, boxShadow: '0 0 24px rgba(20,184,166,0.4)' }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-2xl font-black text-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-60"
                  >
                    {saving ? (
                      <span className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                    ) : (
                      <><PlusCircle size={22} /> Create Listing</>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Shared input style via global style tag ── */}
      <style jsx global>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgb(248 250 252);
          border: 1px solid rgb(226 232 240);
          font-weight: 600;
          font-size: 0.875rem;
          color: rgb(30 41 59);
          outline: none;
          transition: box-shadow 0.15s;
        }
        .input-field:focus {
          box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.25);
          border-color: rgb(20 184 166);
        }
      `}</style>
    </div>
  );
}