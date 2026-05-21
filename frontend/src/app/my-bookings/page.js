'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, MapPin, Mail, Phone, Clock,
  CheckCircle, XCircle, MessageSquare, ArrowRight,
  Shield, AlertCircle, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../lib/api';

export default function MyBookings() {
  const { user, loading } = useAuth();
  const router            = useRouter();

  const [bookings,        setBookings]        = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [cancellingId,    setCancellingId]    = useState(null);
  const [error,           setError]           = useState('');

  // Redirect guests
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setBookingsLoading(true);
    setError('');
    try {
      const res = await api.get('/bookings/my');
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch your bookings. Please try again.');
    } finally {
      setBookingsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;
    setCancellingId(bookingId);
    setError('');
    try {
      await api.delete(`/bookings/${bookingId}`);
      // Update booking status in local state
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* Header */}
      <div className="pt-28 pb-10 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/20 blur-[100px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-teal-400 font-bold text-sm uppercase tracking-widest mb-1">Student Portal</p>
          <h1 className="text-4xl font-black mb-2">My Bookings</h1>
          <p className="text-slate-400 font-medium">Track your room booking requests and contact landlords.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {bookingsLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 shadow border border-slate-100 animate-pulse h-48" />
              ))}
            </motion.div>
          ) : bookings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center"
            >
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">No bookings found</h3>
              <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">
                You haven't requested to book any rooms yet. Find your perfect student home today!
              </p>
              <Link href="/room">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-black px-8 py-3.5 rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  Explore Rooms <ArrowRight size={16} />
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {bookings.map((b, i) => {
                const roomImg = b.room?.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500';
                const isPending = b.status === 'pending';
                const isConfirmed = b.status === 'confirmed';
                const isRejected = b.status === 'rejected';
                const isCancelled = b.status === 'cancelled';
                const landlord = b.room?.owner;

                return (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 flex flex-col md:flex-row gap-6 items-stretch overflow-hidden relative hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Status indicator line */}
                    {isConfirmed && <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500" />}
                    {isRejected && <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />}
                    {isCancelled && <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-400" />}
                    {isPending && <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400" />}

                    {/* Room Image */}
                    <div className="w-full md:w-64 shrink-0 relative rounded-2xl overflow-hidden aspect-video md:aspect-auto min-h-[140px] bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={roomImg} alt={b.room?.title} className="object-cover w-full h-full" />
                      <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur text-white px-3 py-1 rounded-xl text-xs font-black">
                        ₹{b.room?.price?.toLocaleString('en-IN') || 0}/mo
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between gap-4 w-full">
                      <div>
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <div>
                            <h4 className="text-lg font-black text-slate-800 line-clamp-1">{b.room?.title || 'Unknown Room'}</h4>
                            <p className="text-slate-500 text-xs flex items-center gap-1 mt-0.5 font-semibold">
                              <MapPin size={12} className="text-teal-500" />
                              {b.room?.location?.address || 'Address N/A'}, {b.room?.location?.city || 'City N/A'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            isPending ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            isConfirmed ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                            isRejected ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            {isPending ? 'Pending Approval' : isConfirmed ? 'Confirmed' : isRejected ? 'Denied' : 'Cancelled'}
                          </span>
                        </div>

                        {/* Dates info */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/50 flex flex-wrap items-center gap-x-8 gap-y-3 mt-3 text-xs">
                          <div>
                            <span className="text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Check-in</span>
                            <span className="font-black text-slate-700">
                              {new Date(b.checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          {b.checkOut && (
                            <div className="md:border-l md:border-slate-200 md:pl-8">
                              <span className="text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Check-out</span>
                              <span className="font-black text-slate-700">
                                {new Date(b.checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          )}
                          <div className="md:border-l md:border-slate-200 md:pl-8">
                            <span className="text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Total Price Paid/Due</span>
                            <span className="font-black text-teal-600 text-sm">₹{b.totalPrice?.toLocaleString('en-IN') || 0}</span>
                          </div>
                        </div>

                        {/* Landlord Contact Info */}
                        {landlord && (
                          <div className="mt-4 border-t border-slate-100 pt-3">
                            <p className="text-xs text-slate-400 font-black uppercase tracking-wider mb-2">Landlord Contact Details</p>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-700">
                              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                <div className="h-6 w-6 rounded-full bg-teal-100 text-teal-700 text-xs font-black flex items-center justify-center">
                                  {landlord.name?.[0]?.toUpperCase() || 'L'}
                                </div>
                                {landlord.name || 'Room Owner'}
                              </div>
                              <a href={`mailto:${landlord.email}`} className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1 transition">
                                <Mail size={13} className="text-teal-500" /> {landlord.email}
                              </a>
                              {landlord.phone && (
                                <a href={`tel:${landlord.phone}`} className="text-xs text-slate-500 hover:text-teal-600 flex items-center gap-1 transition">
                                  <Phone size={13} className="text-teal-500" /> {landlord.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Student Personal Message */}
                        {b.message && (
                          <div className="mt-3 bg-teal-50/40 border border-teal-100/40 rounded-2xl p-3 text-xs italic text-slate-600 flex gap-2">
                            <MessageSquare size={14} className="text-teal-500 shrink-0 mt-0.5" />
                            <span>Your message: "{b.message}"</span>
                          </div>
                        )}
                      </div>

                      {/* Cancel action button */}
                      {(isPending || isConfirmed) && (
                        <div className="flex justify-end mt-2">
                          <button
                            disabled={cancellingId !== null}
                            onClick={() => handleCancelBooking(b._id)}
                            className="px-5 py-2.5 rounded-xl border border-red-200 hover:bg-red-50 hover:text-red-700 text-red-500 text-xs font-black transition disabled:opacity-50 cursor-pointer duration-300 active:scale-95"
                          >
                            {cancellingId === b._id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
