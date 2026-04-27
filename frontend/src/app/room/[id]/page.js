'use client';
import React, { use } from 'react';
import { rooms } from '../page';
import { MapPin, Star, Wifi, Droplets, Zap, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RoomDetailsPage({ params }) {
  const unwrappedParams = use(params);
  const roomId = parseInt(unwrappedParams.id);
  const room = rooms.find(r => r.id === roomId);

  if (!room) {
    return (
      <div className="container mx-auto px-6 py-32 text-center mt-[60px]">
        <h1 className="text-4xl font-black text-slate-800 mb-4">Room Not Found</h1>
        <Link href="/room" className="text-teal-600 font-bold hover:underline">
          &larr; Back to all rooms
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 mt-[60px]">
      <Link href="/room" className="inline-flex items-center gap-2 text-slate-500 hover:text-teal-600 font-bold mb-8 transition">
        <ArrowLeft size={18} /> Back to Rooms
      </Link>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-lg relative">
              <Image src={room.img} alt={room.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-black text-slate-800 mb-2">{room.name}</h1>
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <MapPin size={18} /> {room.location}
                </p>
              </div>
              <div className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-xl flex items-center gap-1 font-black">
                <Star size={16} fill="currentColor" /> {room.rating}
              </div>
            </div>

            <div className="py-6 border-y border-slate-100 my-6">
              <span className="text-4xl font-black text-teal-600">{room.price}</span>
              <span className="text-slate-400 font-medium ml-2">/ month</span>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
              <p className="text-slate-600 leading-relaxed">
                {room.description || "A wonderful place to stay with all essential amenities and close to the campus. Perfect for students looking for comfort and convenience."}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {room.amenities ? room.amenities.map((amenity, index) => (
                  <span key={index} className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                    {amenity}
                  </span>
                )) : (
                  <>
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Wifi size={14}/> Wi-Fi</span>
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Zap size={14}/> Power Backup</span>
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Droplets size={14}/> Water Supply</span>
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2"><Shield size={14}/> Security</span>
                  </>
                )}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg hover:shadow-teal-500/30 transition-all hover:-translate-y-1">
              Contact Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
