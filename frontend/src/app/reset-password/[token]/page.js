'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, Sparkles, CheckCircle } from 'lucide-react';
import api from '../../lib/api';

export default function ResetPasswordPage({ params }) {
  const { token }     = use(params);
  const router        = useRouter();

  const [password,    setPassword]    = useState('');
  const [confirm,     setConfirm]     = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [error,       setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      // Auto redirect to login after 3s
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. The link may have expired.');
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

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center py-4"
            >
              <div className="bg-teal-50 p-4 rounded-2xl mb-5 border border-teal-100">
                <CheckCircle size={40} className="text-teal-500" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3">Password Reset! 🎉</h2>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">
                Your password has been updated successfully. Redirecting you to login…
              </p>
              <Link href="/login" className="text-teal-600 font-bold hover:underline">
                Go to Login →
              </Link>
            </motion.div>
          ) : (
            <>
              <div className="flex flex-col items-center mb-8">
                <div className="bg-teal-500 p-3 rounded-2xl shadow-lg mb-4">
                  <Sparkles size={26} className="text-white" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">
                  Create New Password
                </h1>
                <p className="text-slate-500 text-sm mt-2 font-medium text-center">
                  Choose a strong password for your NEST account
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

                {/* New Password */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reset-password"
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Min. 6 characters"
                      className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
                    />
                    <button type="button" onClick={() => setShowPass((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition">
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      id="reset-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      placeholder="Re-enter password"
                      className={`w-full pl-11 pr-12 py-3.5 rounded-xl bg-slate-100/80 border text-slate-800 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                        confirm && password !== confirm
                          ? 'border-red-300 focus:ring-red-300'
                          : 'border-slate-200 focus:ring-teal-400'
                      }`}
                    />
                    <button type="button" onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-500 transition">
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-red-500 text-xs font-semibold mt-1">Passwords don't match</p>
                  )}
                </div>

                {/* Strength hint */}
                {password.length > 0 && (
                  <div className="flex gap-1.5">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 3
                          ? i < 2 ? 'bg-amber-400' : 'bg-teal-500'
                          : 'bg-slate-200'
                      }`} />
                    ))}
                  </div>
                )}

                <motion.button
                  id="reset-submit"
                  type="submit"
                  disabled={loading || (confirm.length > 0 && password !== confirm)}
                  whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 0 20px rgba(20,184,166,0.4)' }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-2 w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 transition"
                >
                  {loading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    'Reset Password'
                  )}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </main>
  );
}
