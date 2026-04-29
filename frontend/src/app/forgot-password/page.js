'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';
import api from '../lib/api';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background blobs */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-teal-200/40 rounded-full blur-[120px] -z-0"
      />
      <motion.div
        animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px] -z-0"
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/60 backdrop-blur-2xl border border-white/70 rounded-3xl shadow-2xl p-8 md:p-10">

          {sent ? (
            /* ── Success State ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="bg-teal-50 p-4 rounded-2xl mb-5 border border-teal-100">
                <CheckCircle size={40} className="text-teal-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Check Your Email</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-2">
                If <span className="text-teal-600 font-bold">{email}</span> is registered,
                we've sent a password reset link.
              </p>
              <p className="text-slate-400 text-sm font-medium mb-8">
                The link expires in <strong className="text-slate-600">15 minutes</strong>.
                Check your spam folder if you don't see it.
              </p>
              <Link href="/login" className="text-teal-600 font-bold hover:underline flex items-center gap-1">
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </motion.div>
          ) : (
            /* ── Form State ── */
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="bg-teal-500 p-3 rounded-2xl shadow-lg mb-4">
                  <Sparkles size={26} className="text-white" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">
                  Forgot Password?
                </h1>
                <p className="text-slate-500 text-sm mt-2 font-medium text-center">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                  />
                </div>

                <motion.button
                  id="forgot-submit"
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 0 20px rgba(20,184,166,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 transition"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    'Send Reset Link'
                  )}
                </motion.button>
              </form>

              <div className="text-center mt-6">
                <Link href="/login" className="text-slate-500 text-sm font-medium hover:text-teal-600 flex items-center justify-center gap-1 transition">
                  <ArrowLeft size={15} /> Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
