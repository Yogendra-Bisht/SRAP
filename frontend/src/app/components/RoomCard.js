'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BedDouble, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Fallback placeholder if the room has no images uploaded yet
const PLACEHOLDER = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500';

export default function RoomCard({ room }) {
  const image    = room.images?.[0] || PLACEHOLDER;
  const city     = room.location?.city     || '';
  const address  = room.location?.address  || '';
  const location = city ? `${address ? address + ', ' : ''}${city}` : 'Location TBD';

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={room.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 hover:scale-105"
          unoptimized
        />
        {/* Availability badge */}
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black shadow ${
          room.isAvailable ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
        }`}>
          {room.isAvailable ? 'Available' : 'Booked'}
        </div>
        {/* Room type badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-white/80 backdrop-blur text-slate-700 shadow">
          {room.roomType}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-black text-lg text-slate-800 mb-1 line-clamp-1">{room.title}</h3>

        <p className="text-slate-500 text-sm flex items-center gap-1 mb-3">
          <MapPin size={13} className="text-teal-500 shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </p>

        {/* Amenities preview */}
        {room.amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {room.amenities.slice(0, 3).map((a) => (
              <span key={a} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-lg font-semibold">
                {a}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-lg font-semibold">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Owner */}
        {room.owner && (
          <p className="text-xs text-slate-400 font-semibold mb-3 flex items-center gap-1">
            <Users size={12} />
            Listed by {room.owner.name}
          </p>
        )}

        {/* Price + CTA */}
        <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-100">
          <div>
            <span className="text-2xl font-black text-teal-600">
              ₹{room.price.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-slate-400 ml-1">/mo</span>
          </div>
          <Link href={`/room/${room._id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              View Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
