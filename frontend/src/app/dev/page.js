'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Home, CalendarDays, RefreshCw,
  ShieldAlert, GraduationCap, Building2,
  CheckCircle, XCircle, Clock, BarChart3,
  Eye, EyeOff, MessageCircle
} from 'lucide-react';
import api from '../lib/api';

const TABS = [
  { key: 'overview',  label: 'Overview',  icon: <BarChart3 size={16} /> },
  { key: 'users',     label: 'Users',     icon: <Users size={16} /> },
  { key: 'rooms',     label: 'Rooms',     icon: <Home size={16} /> },
  { key: 'bookings',  label: 'Bookings',  icon: <CalendarDays size={16} /> },
  { key: 'guides',    label: 'Campus Guides', icon: <MessageCircle size={16} /> },
];

const devApi = (path, key) =>
  api.get(`/dev${path}`, { headers: { 'x-dev-key': key } });

// ── Status badge helper ───────────────────────────────────────────────────────
const Badge = ({ value, map }) => {
  const cfg = map[value] || { color: 'bg-slate-100 text-slate-500', label: value };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${cfg.color}`}>
      {cfg.label}
    </span>
  );
};

const roleBadgeMap = {
  student:  { color: 'bg-blue-100 text-blue-700',   label: 'Student' },
  landlord: { color: 'bg-purple-100 text-purple-700', label: 'Landlord' },
};
const statusBadgeMap = {
  pending:   { color: 'bg-amber-100 text-amber-700',   label: 'Pending' },
  confirmed: { color: 'bg-green-100 text-green-700',   label: 'Confirmed' },
  cancelled: { color: 'bg-red-100 text-red-600',       label: 'Cancelled' },
};
const availBadgeMap = {
  true:  { color: 'bg-emerald-100 text-emerald-700', label: 'Available' },
  false: { color: 'bg-slate-100 text-slate-500',     label: 'Booked' },
};

// ── Main Component ────────────────────────────────────────────────────────────
export default function DevDashboard() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [passErr,   setPassErr]   = useState('');

  const [tab,      setTab]      = useState('overview');
  const [stats,    setStats]    = useState(null);
  const [users,    setUsers]    = useState([]);
  const [rooms,    setRooms]    = useState([]);
  const [bookings, setBookings] = useState([]);
  const [guides,   setGuides]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const [sessionKey, setSessionKey] = useState(null);

  const loadAll = useCallback(async (keyToUse) => {
    const key = keyToUse || sessionKey;
    if (!key) return;
    
    setLoading(true);
    try {
      const [s, u, r, b, g] = await Promise.all([
        devApi('/stats', key),
        devApi('/users', key),
        devApi('/rooms', key),
        devApi('/bookings', key),
        devApi('/guides', key),
      ]);
      setStats(s.data);
      setUsers(u.data.users);
      setRooms(r.data.rooms);
      setBookings(b.data.bookings);
      setGuides(g.data.guides);
      setLastSync(new Date());
      return true; // Success
    } catch (err) {
      if (err.response && err.response.status === 403) {
        throw new Error('Incorrect developer key.');
      }
      return false;
    } finally { 
      setLoading(false); 
    }
  }, [sessionKey]);

  // Initial load after unlocking
  useEffect(() => { if (unlocked && sessionKey) loadAll(sessionKey); }, [unlocked, sessionKey, loadAll]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passInput.trim()) return;
    
    setPassErr('');
    try {
      // Test the key by attempting to fetch stats
      await loadAll(passInput);
      
      // If it didn't throw, the key is valid
      setSessionKey(passInput);
      setUnlocked(true);
    } catch (err) {
      setPassErr(err.message || 'Failed to connect.');
    }
  };

  const handleDeleteGuide = async (id) => {
    if (!confirm('Permanently delete this guide post?')) return;
    try {
      await api.delete(`/dev/guides/${id}`, { headers: { 'x-dev-key': sessionKey } });
      setGuides(guides.filter(g => g._id !== id));
      // update stats locally
      setStats(s => ({...s, guides: {total: s.guides.total - 1}}));
    } catch (err) {
      alert('Delete failed');
    }
  };

  // ── Lock screen ──────────────────────────────────────────────────────────
  if (!unlocked) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-teal-900/40 via-slate-900 to-slate-900" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-sm"
        >
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="bg-teal-500/20 p-4 rounded-2xl mb-4 border border-teal-500/30">
                <ShieldAlert size={32} className="text-teal-400" />
              </div>
              <h1 className="text-2xl font-black text-white">Developer Access</h1>
              <p className="text-slate-400 text-sm mt-1 font-medium text-center">
                Enter the developer key to access the monitoring panel.
              </p>
            </div>

            {passErr && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold text-center"
              >
                {passErr}
              </motion.div>
            )}

            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="relative">
                <input
                  id="dev-key-input"
                  type={showPass ? 'text' : 'password'}
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="Enter developer key..."
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-700/60 border border-slate-600 text-white font-semibold placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400 transition"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <motion.button
                id="dev-unlock-btn"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full bg-teal-500 hover:bg-teal-400 text-white font-black py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <ShieldAlert size={18} /> Unlock Dashboard
              </motion.button>
            </form>
          </div>
        </motion.div>
      </main>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Header */}
      <div className="pt-24 pb-6 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-teal-400 text-xs font-bold uppercase tracking-widest">Live Monitor</span>
            </div>
            <h1 className="text-3xl font-black">Developer Dashboard</h1>
            {lastSync && (
              <p className="text-slate-500 text-xs font-medium mt-1">
                Last synced: {lastSync.toLocaleTimeString()}
              </p>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadAll(sessionKey)}
            disabled={loading}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </motion.button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-slate-800/50 p-1.5 rounded-2xl w-fit">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
                tab === t.key
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── OVERVIEW TAB ── */}
          {tab === 'overview' && stats && (
            <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: 'Total Users',    value: stats.users.total,    icon: <Users size={20} />,        color: 'text-blue-400',   bg: 'bg-blue-500/10' },
                  { label: 'Total Rooms',    value: stats.rooms.total,    icon: <Home size={20} />,         color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: 'Total Bookings', value: stats.bookings.total, icon: <CalendarDays size={20} />, color: 'text-amber-400',  bg: 'bg-amber-500/10' },
                  { label: 'Available Rooms',value: stats.rooms.available,icon: <CheckCircle size={20} />,  color: 'text-teal-400',   bg: 'bg-teal-500/10' },
                  { label: 'Guide Posts',    value: stats.guides?.total || 0, icon: <MessageCircle size={20} />, color: 'text-pink-400',  bg: 'bg-pink-500/10' },
                ].map((s) => (
                  <div key={s.label} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                      {s.icon}
                    </div>
                    <p className="text-3xl font-black">{s.value}</p>
                    <p className="text-slate-400 text-xs font-semibold mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Breakdown grids */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Users breakdown */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="font-black text-slate-300 mb-4 flex items-center gap-2">
                    <Users size={16} className="text-blue-400" /> Users Breakdown
                  </h3>
                  {[
                    { label: 'Students',  value: stats.users.students,  icon: <GraduationCap size={14} />, color: 'text-blue-400' },
                    { label: 'Landlords', value: stats.users.landlords, icon: <Building2 size={14} />,     color: 'text-purple-400' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                      <span className={`flex items-center gap-2 text-sm font-semibold ${r.color}`}>{r.icon}{r.label}</span>
                      <span className="font-black text-white text-lg">{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Rooms breakdown */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="font-black text-slate-300 mb-4 flex items-center gap-2">
                    <Home size={16} className="text-purple-400" /> Rooms Breakdown
                  </h3>
                  {[
                    { label: 'Available', value: stats.rooms.available, color: 'text-teal-400' },
                    { label: 'Booked',    value: stats.rooms.booked,    color: 'text-red-400' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                      <span className={`text-sm font-semibold ${r.color}`}>{r.label}</span>
                      <span className="font-black text-white text-lg">{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Bookings breakdown */}
                <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                  <h3 className="font-black text-slate-300 mb-4 flex items-center gap-2">
                    <CalendarDays size={16} className="text-amber-400" /> Bookings Breakdown
                  </h3>
                  {[
                    { label: 'Pending',   value: stats.bookings.pending,   icon: <Clock size={14} />,       color: 'text-amber-400' },
                    { label: 'Confirmed', value: stats.bookings.confirmed, icon: <CheckCircle size={14} />, color: 'text-green-400' },
                    { label: 'Cancelled', value: stats.bookings.cancelled, icon: <XCircle size={14} />,     color: 'text-red-400' },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-3 border-b border-slate-700/50 last:border-0">
                      <span className={`flex items-center gap-2 text-sm font-semibold ${r.color}`}>{r.icon}{r.label}</span>
                      <span className="font-black text-white text-lg">{r.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── USERS TAB ── */}
          {tab === 'users' && (
            <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-700/50 flex items-center justify-between">
                  <h3 className="font-black text-slate-200">All Users <span className="text-teal-400 ml-2">{users.length}</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-widest">
                        <th className="text-left p-4 font-bold">Name</th>
                        <th className="text-left p-4 font-bold">Email</th>
                        <th className="text-left p-4 font-bold">Role</th>
                        <th className="text-left p-4 font-bold">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <motion.tr
                          key={u._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-700/30 hover:bg-slate-700/30 transition"
                        >
                          <td className="p-4 font-bold text-white">{u.name}</td>
                          <td className="p-4 text-slate-300 font-medium">{u.email}</td>
                          <td className="p-4"><Badge value={u.role} map={roleBadgeMap} /></td>
                          <td className="p-4 text-slate-400 font-medium">
                            {new Date(u.createdAt).toLocaleDateString('en-IN')}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {users.length === 0 && (
                    <p className="text-center text-slate-500 py-12 font-medium">No users yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ROOMS TAB ── */}
          {tab === 'rooms' && (
            <motion.div key="rooms" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-700/50">
                  <h3 className="font-black text-slate-200">All Rooms <span className="text-teal-400 ml-2">{rooms.length}</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-widest">
                        <th className="text-left p-4 font-bold">Title</th>
                        <th className="text-left p-4 font-bold">City</th>
                        <th className="text-left p-4 font-bold">Price</th>
                        <th className="text-left p-4 font-bold">Type</th>
                        <th className="text-left p-4 font-bold">Status</th>
                        <th className="text-left p-4 font-bold">Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map((r, i) => (
                        <motion.tr
                          key={r._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-700/30 hover:bg-slate-700/30 transition"
                        >
                          <td className="p-4 font-bold text-white max-w-[200px] truncate">{r.title}</td>
                          <td className="p-4 text-slate-300 font-medium">{r.location?.city}</td>
                          <td className="p-4 text-teal-400 font-black">₹{r.price?.toLocaleString('en-IN')}</td>
                          <td className="p-4 text-slate-300 font-medium">{r.roomType}</td>
                          <td className="p-4"><Badge value={String(r.isAvailable)} map={availBadgeMap} /></td>
                          <td className="p-4 text-slate-400 font-medium">{r.owner?.name || '—'}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {rooms.length === 0 && (
                    <p className="text-center text-slate-500 py-12 font-medium">No rooms listed yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── BOOKINGS TAB ── */}
          {tab === 'bookings' && (
            <motion.div key="bookings" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-700/50">
                  <h3 className="font-black text-slate-200">All Bookings <span className="text-teal-400 ml-2">{bookings.length}</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-widest">
                        <th className="text-left p-4 font-bold">Student</th>
                        <th className="text-left p-4 font-bold">Room</th>
                        <th className="text-left p-4 font-bold">Price</th>
                        <th className="text-left p-4 font-bold">Check-in</th>
                        <th className="text-left p-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b, i) => (
                        <motion.tr
                          key={b._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-700/30 hover:bg-slate-700/30 transition"
                        >
                          <td className="p-4">
                            <p className="font-bold text-white">{b.student?.name}</p>
                            <p className="text-slate-400 text-xs">{b.student?.email}</p>
                          </td>
                          <td className="p-4 text-slate-300 font-medium max-w-[160px] truncate">{b.room?.title}</td>
                          <td className="p-4 text-teal-400 font-black">₹{b.totalPrice?.toLocaleString('en-IN')}</td>
                          <td className="p-4 text-slate-400 font-medium">
                            {new Date(b.checkIn).toLocaleDateString('en-IN')}
                          </td>
                          <td className="p-4"><Badge value={b.status} map={statusBadgeMap} /></td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && (
                    <p className="text-center text-slate-500 py-12 font-medium">No bookings yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── GUIDES TAB ── */}
          {tab === 'guides' && (
            <motion.div key="guides" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-700/50">
                  <h3 className="font-black text-slate-200">Campus Guides <span className="text-teal-400 ml-2">{guides.length}</span></h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/50 text-slate-400 text-xs uppercase tracking-widest">
                        <th className="text-left p-4 font-bold">Author</th>
                        <th className="text-left p-4 font-bold">Title</th>
                        <th className="text-left p-4 font-bold">Category</th>
                        <th className="text-left p-4 font-bold">Interactions</th>
                        <th className="text-right p-4 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guides.map((g, i) => (
                        <motion.tr
                          key={g._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-slate-700/30 hover:bg-slate-700/30 transition"
                        >
                          <td className="p-4">
                            <p className="font-bold text-white">{g.author ? g.author.name : g.guestName}</p>
                            <Badge value={g.author ? g.author.role : 'Guest'} map={{...roleBadgeMap, Guest: {color: 'bg-slate-100 text-slate-600', label: 'Guest'}}} />
                          </td>
                          <td className="p-4 text-slate-300 font-medium max-w-[200px] truncate">{g.title}</td>
                          <td className="p-4 text-slate-400">{g.category}</td>
                          <td className="p-4 text-slate-400">
                            <span className="flex gap-3">
                              <span>❤️ {g.likes?.length || 0}</span>
                              <span>💬 {g.comments?.length || 0}</span>
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDeleteGuide(g._id)} className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-1.5 rounded-lg font-bold transition">
                              Delete
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {guides.length === 0 && (
                    <p className="text-center text-slate-500 py-12 font-medium">No guides posted yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
