'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function RoomCard({ room }) {
  return (
    <motion.div whileHover={{ y: -10 }} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image src={room.img} alt={room.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-slate-800">{room.name}</h3>
          <span className="flex items-center gap-1 text-xs font-bold bg-teal-50 text-teal-700 px-2 py-1 rounded-lg">
            <Star size={12} fill="currentColor" /> {room.rating}
          </span>
        </div>
        <p className="text-slate-500 text-sm flex items-center gap-1 mb-4 flex-1">
          <MapPin size={14} /> {room.location}
        </p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-black text-teal-600">{room.price}<span className="text-xs text-slate-400">/mo</span></span>
          <Link href={`/room/${room.id}`}>
            <button className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition hover:bg-slate-800">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
