'use client';

import React, { use, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, ArrowLeft, Wifi, Zap, Droplets, Shield, Wind,
  Car, Dumbbell, Camera, ChefHat, BedDouble, Users, CalendarDays
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('../../components/MapView'), { ssr: false });

const PLACEHOLDER = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500';

// Amenity → icon mapping
const amenityIcons = {
  'WiFi':          <Wifi size={14} />,
  'AC':            <Wind size={14} />,
  'Laundry':       <Droplets size={14} />,
  'Parking':       <Car size={14} />,
  'Meals':         <ChefHat size={14} />,
  'Hot Water':     <Droplets size={14} />,
  'Power Backup':  <Zap size={14} />,
  'CCTV':          <Camera size={14} />,
  'Gym':           <Dumbbell size={14} />,
};

export default function RoomDetailsPage({ params }) {
  const { id }          = use(params);
  const { user }        = useAuth();
  const router          = useRouter();

  const [room,    setRoom]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Booking state
  const [checkIn,  setCheckIn]  = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [message,  setMessage]  = useState('');
  const [booking,  setBooking]  = useState(false);
  const [booked,   setBooked]   = useState(false);
  const [bookErr,  setBookErr]  = useState('');

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${id}`);
        setRoom(res.data.room);
      } catch (err) {
        setError(err.response?.data?.message || 'Room not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }
    setBooking(true);
    setBookErr('');
    try {
      await api.post('/bookings', {
        roomId: room._id,
        checkIn,
        checkOut: checkOut || undefined,
        message,
      });
      setBooked(true);
    } catch (err) {
      setBookErr(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  /* ── Error ── */
  if (error || !room) {
    return (
      <div className="container mx-auto px-6 py-32 text-center mt-[60px]">
        <h1 className="text-4xl font-black text-slate-800 mb-4">Room Not Found</h1>
        <Link href="/room" className="text-teal-600 font-bold hover:underline">
          ← Back to all rooms
        </Link>
      </div>
    );
  }

  const image    = room.images?.[0] || PLACEHOLDER;
  const city     = room.location?.city    || '';
  const address  = room.location?.address || '';
  const location = [address, city, room.location?.state].filter(Boolean).join(', ');

  const coords   = room.location?.coordinates?.coordinates || [];
  const longitude = coords[0];
  const latitude  = coords[1];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* Top image hero */}
      <div className="relative w-full h-72 md:h-[420px]">
        <Image
          src={image}
          alt={room.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Back button */}
        <div className="absolute top-24 left-6">
          <Link href="/room">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-white/90 backdrop-blur text-slate-800 font-bold px-4 py-2 rounded-xl shadow-lg text-sm"
            >
              <ArrowLeft size={16} />
              Back
            </motion.button>
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-black bg-teal-500 text-white px-3 py-1 rounded-full mb-2 inline-block">
                {room.roomType} · {room.gender}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-lg">{room.title}</h1>
              <p className="text-white/80 flex items-center gap-1.5 mt-1 font-medium">
                <MapPin size={15} />
                {location}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-2xl font-black text-sm shadow-lg ${
              room.isAvailable ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
            }`}>
              {room.isAvailable ? '✓ Available' : '✗ Booked'}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left — details */}
        <div className="lg:col-span-2 space-y-8">

          {/* Price strip */}
          <div className="bg-white rounded-3xl p-6 shadow border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-4xl font-black text-teal-600">
                ₹{room.price.toLocaleString('en-IN')}
              </span>
              <span className="text-slate-400 font-medium ml-2">/ month</span>
            </div>
            {room.owner && (
              <div className="text-right">
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Listed by</p>
                <p className="font-bold text-slate-800">{room.owner.name}</p>
                <p className="text-sm text-teal-600 font-semibold">{room.owner.phone || room.owner.email}</p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-3xl p-6 shadow border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-3">About this room</h2>
            <p className="text-slate-600 leading-relaxed">{room.description}</p>
          </div>

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="bg-white rounded-3xl p-6 shadow border border-slate-100">
              <h2 className="text-xl font-black text-slate-800 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-3">
                {room.amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-2 bg-teal-50 text-teal-700 border border-teal-100 px-4 py-2 rounded-xl text-sm font-bold"
                  >
                    {amenityIcons[a] || <BedDouble size={14} />}
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability dates */}
          <div className="bg-white rounded-3xl p-6 shadow border border-slate-100 flex items-center gap-4">
            <CalendarDays size={22} className="text-teal-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available From</p>
              <p className="font-black text-slate-800 text-lg">
                {new Date(room.availableFrom).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Map View */}
          <MapView
            latitude={latitude}
            longitude={longitude}
            address={address}
            city={city}
          />
        </div>

        {/* Right — booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
            <h2 className="text-xl font-black text-slate-800 mb-5">Book This Room</h2>

            {booked ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="font-black text-xl text-teal-600 mb-2">Booking Requested!</h3>
                <p className="text-slate-500 text-sm font-medium mb-5">
                  The landlord will confirm your booking soon.
                </p>
                <Link href="/room">
                  <button className="text-teal-600 font-bold hover:underline text-sm">
                    Browse more rooms
                  </button>
                </Link>
              </motion.div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4">
                {bookErr && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold">
                    {bookErr}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Check-in Date *
                  </label>
                  <input
                    id="checkin-date"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Check-out Date (optional)
                  </label>
                  <input
                    id="checkout-date"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-300"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Message to owner (optional)
                  </label>
                  <textarea
                    id="booking-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="Introduce yourself or ask a question..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-300 resize-none"
                  />
                </div>

                <motion.button
                  id="book-now-btn"
                  type="submit"
                  disabled={booking || !room.isAvailable}
                  whileHover={{ scale: booking || !room.isAvailable ? 1 : 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
                >
                  {booking ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : room.isAvailable ? (
                    'Request Booking'
                  ) : (
                    'Currently Unavailable'
                  )}
                </motion.button>

                {!user && (
                  <p className="text-center text-xs text-slate-400 font-medium">
                    <Link href="/login" className="text-teal-600 font-bold">Sign in</Link> to book this room
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
