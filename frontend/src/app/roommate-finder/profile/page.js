'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, CheckCircle2, User, Home, Coffee, Moon, Sparkles } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function RoommateProfileForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    gender: 'Male',
    lookingForGender: 'Any',
    budgetMin: 0,
    budgetMax: 10000,
    smoking: false,
    drinking: false,
    sleepingHabits: 'Flexible',
    cleanliness: 'Average',
    bio: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get('/roommates/profile');
        if (res.data) {
          setFormData({
            gender: res.data.gender || 'Male',
            lookingForGender: res.data.lookingForGender || 'Any',
            budgetMin: res.data.budgetMin || 0,
            budgetMax: res.data.budgetMax || 10000,
            smoking: res.data.smoking || false,
            drinking: res.data.drinking || false,
            sleepingHabits: res.data.sleepingHabits || 'Flexible',
            cleanliness: res.data.cleanliness || 'Average',
            bio: res.data.bio || ''
          });
        }
      } catch (err) {
        // 404 just means they haven't created one yet
        if (err.response?.status !== 404) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaved(false);

    try {
      await api.post('/roommates/profile', formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen pt-24 flex justify-center text-slate-500">Loading profile...</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Roommate Profile</h1>
          <p className="text-slate-500 mt-2">Help the ML algorithm find your perfect match by answering truthfully.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Basics */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <User size={20} className="text-teal-600" />
              <h2 className="text-xl font-bold text-slate-800">Basic Info</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">I am</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Looking for Roommate(s)</label>
                <select name="lookingForGender" value={formData.lookingForGender} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500">
                  <option value="Any">Any Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Home size={20} className="text-teal-600" />
              <h2 className="text-xl font-bold text-slate-800">Budget Range (₹/month)</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Minimum</label>
                <input type="number" name="budgetMin" value={formData.budgetMin} onChange={handleChange} min="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Maximum</label>
                <input type="number" name="budgetMax" value={formData.budgetMax} onChange={handleChange} min="0" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500" />
              </div>
            </div>
          </div>

          {/* Lifestyle & Habits (ML Features) */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <Coffee size={20} className="text-teal-600" />
              <h2 className="text-xl font-bold text-slate-800">Lifestyle & Habits</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Sleeping Habits</label>
                <select name="sleepingHabits" value={formData.sleepingHabits} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500">
                  <option value="Early Bird">Early Bird (Sleep early, wake up early)</option>
                  <option value="Night Owl">Night Owl (Stay up late)</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Cleanliness</label>
                <select name="cleanliness" value={formData.cleanliness} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500">
                  <option value="Very Clean">Very Clean (Neat freak)</option>
                  <option value="Average">Average (Reasonably tidy)</option>
                  <option value="Messy">Messy (Cluttered but fine)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="smoking" checked={formData.smoking} onChange={handleChange} className="w-5 h-5 text-teal-600 accent-teal-500 rounded focus:ring-teal-500" />
                <span className="font-bold text-slate-700">I smoke</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="drinking" checked={formData.drinking} onChange={handleChange} className="w-5 h-5 text-teal-600 accent-teal-500 rounded focus:ring-teal-500" />
                <span className="font-bold text-slate-700">I drink</span>
              </label>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">About Me</h2>
            <textarea 
              name="bio" 
              value={formData.bio} 
              onChange={handleChange} 
              rows={4}
              placeholder="Hi, I'm looking for a chill roommate..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-teal-500"
            ></textarea>
          </div>

          <div className="flex justify-end gap-4">
            <button 
              type="button" 
              onClick={() => router.push('/roommate-finder/matches')}
              className="px-6 py-3 font-bold text-slate-500 hover:text-slate-800 transition"
            >
              Skip to Matches
            </button>
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-teal-500/30 disabled:opacity-50"
            >
              {saving ? 'Saving...' : (saved ? <CheckCircle2 size={18} /> : <Save size={18} />)}
              {saved ? 'Saved!' : 'Save Profile'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
