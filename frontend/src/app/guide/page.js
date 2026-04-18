'use client';
import { motion } from 'framer-motion';
import { HeartPulse, Utensils, Pill, Coffee } from 'lucide-react';

const categories = [
  { name: "Hospitals", icon: <HeartPulse />, color: "bg-red-500", count: 3 },
  { name: "Canteens", icon: <Utensils />, color: "bg-orange-500", count: 12 },
  { name: "Pharmacy", icon: <Pill />, color: "bg-blue-500", count: 5 },
  { name: "Cafes", icon: <Coffee />, color: "bg-amber-700", count: 8 },
];

export default function GuidePage() {
  return (
    <div className="container mx-auto px-6 py-20 mt-[50px]">
      <div className="mb-12">
        <h1 className="text-5xl font-black text-slate-900 mb-4">Campus Guide</h1>
        <p className="text-slate-500 font-medium">Your local directory for essential student services near HNBGU.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={cat.name} 
            className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl group hover:bg-slate-900 transition-all duration-500"
          >
            <div className={`w-14 h-14 rounded-2xl ${cat.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
              {cat.icon}
            </div>
            <h3 className="text-2xl font-black text-slate-800 group-hover:text-white mb-2">{cat.name}</h3>
            <p className="text-slate-500 group-hover:text-slate-400 font-bold">{cat.count} Locations found</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}