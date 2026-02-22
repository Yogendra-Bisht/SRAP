'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-slate-50 ">
      
      {/* --- Foggy Background Blobs --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 ">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, 50, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 100, 0],
            scale: [1, 1.3, 1] 
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[10%] w-[600px] h-[600px]] bg-orange-200/30 rounded-full blur-[130px]"
        />
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-bold mb-6 shadow-sm mt-22">
            <Sparkles size={16} />
            <span>The easiest way to find your college home</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-6">
            Find the Perfect <span className="text-teal-600">Nest</span> <br /> 
            Near Your Campus
          </h1>
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 font-medium">
            Verified rooms, transparent prices, and a complete campus guide 
            tailored for students like you.
          </p>

          {/* --- Glassmorphism Search Bar --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-3xl mx-auto p-2 rounded-3xl bg-white/40 backdrop-blur-2xl border border-white/60 shadow-2xl flex flex-col md:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-3 px-4 py-3 w-full">
              <MapPin className="text-teal-600" size={20} />
              <input 
                type="text" 
                placeholder="Search by college or locality..." 
                className="bg-transparent border-none outline-none text-slate-800 w-full font-semibold placeholder:text-slate-400"
              />
            </div>
            
            <div className="h-8 w-1px bg-slate-300 hidden md:block"></div>
            
            <button className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95">
              <Search size={20} />
              SEARCH
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;