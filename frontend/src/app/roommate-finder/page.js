'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Users, Sparkles, Target, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RoommateFinderLanding() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 flex flex-col items-center">
      <div className="max-w-4xl w-full px-6">
        
        {/* Header section */}
        <div className="text-center mb-16 mt-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full font-bold text-sm mb-6"
          >
            <Sparkles size={16} />
            <span>AI-Powered Matching</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-slate-800 mb-6 tracking-tight"
          >
            Find Your Perfect <span className="text-teal-500">Roommate</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Our smart recommendation engine uses your lifestyle preferences and habits to find the best possible roommate matches. Stop guessing and start connecting.
          </motion.p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl transition-all"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <Target size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">1. Build Profile</h3>
            <p className="text-slate-500 mb-8">
              Tell us about your habits, budget, and what you're looking for in a roommate. The more accurate you are, the better the matches!
            </p>
            <Link href={user ? "/roommate-finder/profile" : "/login"} className="mt-auto w-full">
              <button className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition">
                {user ? "Edit My Profile" : "Login to Start"}
              </button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl transition-all"
          >
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">2. See Matches</h3>
            <p className="text-slate-500 mb-8">
              Our ML algorithm compares your profile with others to calculate a compatibility score. Review your top matches and reach out!
            </p>
            <Link href={user ? "/roommate-finder/matches" : "/login"} className="mt-auto w-full">
              <button className="w-full bg-teal-500 hover:bg-teal-400 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-teal-500/30">
                {user ? "View My Matches" : "Login to View"}
              </button>
            </Link>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
