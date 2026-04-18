'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, MapPin, Star } from 'lucide-react';

const rooms = [
  { id: 1, name: "Luxury Studio", price: "₹12,000", location: "Near North Gate", rating: 4.8, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500" },
  { id: 2, name: "Twin Sharing PG", price: "₹7,500", location: "Main Market", rating: 4.5, img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500" },
  { id: 3, name: "Premium Flat", price: "₹15,000", location: "Green Valley", rating: 4.9, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500" },
];

export default function RoomsPage() {
  return (
    <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-8 mt-[60px]">
      {/* Filter Sidebar */}
      <aside className="w-full md:w-64 space-y-8">
        <div className="p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-white shadow-xl">
          <div className="flex items-center gap-2 mb-6 font-black text-slate-800">
            <Filter size={18} className="text-teal-600" /> FILTERS
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Budget</label>
              <input type="range" className="w-full accent-teal-600" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</label>
              <select className="w-full p-2 bg-transparent border-b border-slate-200 text-sm font-semibold outline-none">
                <option>Single Room</option>
                <option>Double Sharing</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <motion.div whileHover={{ y: -10 }} key={room.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <img src={room.img} className="h-48 w-full object-cover" />
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-800">{room.name}</h3>
                <span className="flex items-center gap-1 text-xs font-bold bg-teal-50 text-teal-700 px-2 py-1 rounded-lg">
                  <Star size={12} fill="currentColor" /> {room.rating}
                </span>
              </div>
              <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                <MapPin size={14} /> {room.location}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-black text-teal-600">{room.price}<span className="text-xs text-slate-400">/mo</span></span>
                <button className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl">View Details</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}