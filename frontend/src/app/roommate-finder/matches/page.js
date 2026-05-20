'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, SearchX, CheckCircle, MapPin, Phone, Mail, Sparkles, Moon, Coffee, Edit3 } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function RoommateMatches() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchMatches = async () => {
      try {
        const res = await api.get('/roommates/matches');
        setMatches(res.data);
      } catch (err) {
        if (err.response?.status === 400) {
          setError(err.response.data.message);
        } else {
          setError('Failed to fetch matches. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-slate-50 flex flex-col items-center justify-center">
        <Sparkles className="animate-spin text-teal-500 mb-4" size={32} />
        <p className="text-slate-500 font-bold">Calculating ML Matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-12 bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-3xl flex items-center justify-center mb-6">
          <SearchX size={40} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-4 text-center">{error}</h2>
        <Link href="/roommate-finder/profile">
          <button className="bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-teal-500/30 flex items-center gap-2">
            <Edit3 size={18} />
            Create/Edit Profile
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              Your Matches <Sparkles className="text-teal-500" size={28} />
            </h1>
            <p className="text-slate-500 mt-2 font-medium">Ranked by our AI based on your lifestyle preferences.</p>
          </div>
          <Link href="/roommate-finder/profile">
            <button className="bg-white border border-slate-200 hover:border-teal-500 text-slate-600 hover:text-teal-600 font-bold py-2.5 px-6 rounded-xl transition flex items-center gap-2 shadow-sm">
              <Edit3 size={16} />
              Refine Profile
            </button>
          </Link>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No matches found right now</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We couldn't find anyone matching your strict criteria (like budget or gender preferences). Try broadening your search!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((m, idx) => (
              <motion.div
                key={m.profile._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all flex flex-col group relative"
              >
                {/* Match Percentage Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <div className={`px-3 py-1.5 rounded-full font-black text-sm shadow-md flex items-center gap-1 
                    ${m.matchPercentage >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white' : 
                      m.matchPercentage >= 50 ? 'bg-yellow-400 text-yellow-900' : 'bg-slate-200 text-slate-600'}`}>
                    {m.matchPercentage}% Match
                  </div>
                </div>

                <div className="p-6 pb-0 flex flex-col items-center border-b border-slate-50 pb-6">
                  <div className="w-24 h-24 bg-gradient-to-tr from-teal-100 to-teal-50 rounded-full flex items-center justify-center text-teal-600 text-3xl font-black mb-4 shadow-inner ring-4 ring-white">
                    {m.profile.user.name.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 text-center">{m.profile.user.name}</h3>
                  <p className="text-slate-500 text-sm font-medium">{m.profile.gender}</p>
                </div>

                <div className="p-6 flex-grow bg-slate-50/50">
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Budget Match</p>
                    <p className="text-slate-700 font-bold">₹{m.profile.budgetMin} - ₹{m.profile.budgetMax}</p>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-100">
                      <Moon size={16} className="text-indigo-500" />
                      <span className="font-semibold">{m.profile.sleepingHabits}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-100">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span className="font-semibold">{m.profile.cleanliness} Cleanliness</span>
                    </div>
                  </div>

                  {m.profile.bio && (
                    <div className="mb-4 text-sm text-slate-500 italic border-l-2 border-teal-200 pl-3">
                      "{m.profile.bio}"
                    </div>
                  )}
                </div>

                <div className="p-4 bg-white border-t border-slate-100">
                  <a 
                    href={`mailto:${m.profile.user.email}`} 
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition flex justify-center items-center gap-2"
                  >
                    <Mail size={16} />
                    Connect
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
