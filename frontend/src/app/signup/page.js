'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Sparkles, Eye, EyeOff, GraduationCap, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [form, setForm]         = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-28 pb-12 relative overflow-hidden">

      {/* Background blobs */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[120px] -z-0"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-orange-200/30 rounded-full blur-[120px] -z-0"
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/60 backdrop-blur-2xl border border-white/70 rounded-3xl shadow-2xl p-8 md:p-10">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-teal-500 p-3 rounded-2xl shadow-lg mb-4">
              <Sparkles size={26} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Join <span className="text-teal-500">NEST</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">
              Create your account to get started
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold"
            >
              {error}
            </motion.div>
          )}

          {/* Role Selector */}
          <div className="flex gap-3 mb-5">
            <button
              id="role-student"
              type="button"
              onClick={() => setForm((p) => ({ ...p, role: 'student' }))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                form.role === 'student'
                  ? 'bg-teal-500 text-white border-teal-500 shadow-lg'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-teal-300'
              }`}
            >
              <GraduationCap size={18} />
              Student
            </button>
            <button
              id="role-landlord"
              type="button"
              onClick={() => setForm((p) => ({ ...p, role: 'landlord' }))}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                form.role === 'landlord'
                  ? 'bg-teal-500 text-white border-teal-500 shadow-lg'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-teal-300'
              }`}
            >
              <Building2 size={18} />
              Landlord
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Name */}
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="signup-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Full name"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="signup-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email address"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="signup-password"
                type={showPass ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Password (min. 6 characters)"
                className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit */}
            <motion.button
              id="signup-submit"
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 0 20px rgba(20,184,166,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 transition"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-slate-500 text-sm mt-6 font-medium">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-600 font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
