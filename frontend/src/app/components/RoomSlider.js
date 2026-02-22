'use client';
import { motion } from 'framer-motion';

const rooms = [
  { id: 1, name: "Premium Studio", price: "₹8,500", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500" },
  { id: 2, name: "Single Sharing PG", price: "₹6,000", image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500" },
  { id: 3, name: "Luxury Apartment", price: "₹12,000", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500" },
  { id: 4, name: "Student Pods", price: "₹4,500", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=500" },
  { id: 5, name: "Co-living Space", price: "₹7,200", image: "https://images.unsplash.com/photo-1536376074432-db42fa45f29a?w=500" },
];

const RoomSlider = () => {
  return (
    <div className="py-20 bg-white overflow-hidden">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-slate-800">Popular Destinations</h2>
        <p className="text-slate-500 font-medium">Handpicked rooms trending this week</p>
      </div>

      <div className="flex relative">
        {/* We double the array to create a seamless infinite loop */}
        <motion.div 
          className="flex gap-6 px-6"
          animate={{ x: [0, -1035] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {[...rooms, ...rooms].map((room, index) => (
            <div key={index} className=" min-w-[300px] h-[400px] rounded-3xl overflow-hidden relative group shadow-xl">
              <img src={room.image} alt={room.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-teal-400 font-bold text-sm uppercase">{room.price}/mo</span>
                <h3 className="text-white text-xl font-bold">{room.name}</h3>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RoomSlider;