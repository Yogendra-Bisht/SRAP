'use client';
import React from 'react';
import { Filter } from 'lucide-react';
import RoomCard from '../components/RoomCard';

export const rooms = [
  { id: 1, name: "Luxury Studio", price: "₹12,000", location: "Near North Gate", rating: 4.8, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500", type: "Single Room", description: "A beautifully furnished studio with attached bathroom and kitchenette.", amenities: ["Wi-Fi", "AC", "Laundry"] },
  { id: 2, name: "Twin Sharing PG", price: "₹7,500", location: "Main Market", rating: 4.5, img: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500", type: "Double Sharing", description: "Spacious room perfect for two students. Includes study tables and almirahs.", amenities: ["Meals", "Cleaning", "Power Backup"] },
  { id: 3, name: "Premium Flat", price: "₹15,000", location: "Green Valley", rating: 4.9, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500", type: "Single Room", description: "Premium flat with balcony and amazing views. Very close to campus.", amenities: ["Gym", "Security", "Parking"] },
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
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}