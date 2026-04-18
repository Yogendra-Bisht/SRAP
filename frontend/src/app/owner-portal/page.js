'use client';
import { motion } from 'framer-motion';
import { PlusCircle, List, BarChart3, MessageSquare } from 'lucide-react';

export default function OwnerPortal() {
  const stats = [
    { label: "Active Listings", value: "0", icon: <List /> },
    { label: "Total Inquiries", value: "0", icon: <MessageSquare /> },
  ];

  return (
    <div className="container mx-auto px-6 py-20 max-w-4xl mt-[60px]">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[100px]"></div>
        
        <h1 className="text-4xl font-black mb-4">Owner Dashboard</h1>
        <p className="text-slate-400 mb-10">Welcome back! Manage your listings and connect with students.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-3xl flex items-center gap-4">
              <div className="text-teal-400">{s.icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">{s.label}</p>
                <p className="text-2xl font-black">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-teal-500 hover:bg-teal-400 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all"
        >
          <PlusCircle size={24} /> ADD NEW LISTING
        </motion.button>
      </div>
    </div>
  );
}