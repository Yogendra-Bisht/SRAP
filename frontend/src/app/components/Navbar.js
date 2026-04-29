'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Map, Search, Sparkles, LogIn, UserPlus, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout }        = useAuth();
  const router                  = useRouter();

  const navLinks = [
    { name: 'Home',         href: '/',      icon: <Home size={18} /> },
    { name: 'Find Rooms',   href: '/room',  icon: <Search size={18} /> },
    { name: 'Campus Guide', href: '/guide', icon: <Map size={18} /> },
  ];

  const menuVariants = {
    closed: { opacity: 0, y: -20, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    opened: { opacity: 1, y: 0,   transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
  };
  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    opened: { opacity: 1, x: 0 },
  };

  const handleLogout = () => {
    logout();
    setUserMenu(false);
    setIsOpen(false);
    router.push('/');
  };

  return (
    <nav className="fixed w-[95%] left-1/2 -translate-x-1/2 top-4 z-50 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-teal-500 p-1.5 rounded-lg shadow-lg">
              <Sparkles size={20} className="text-white" />
            </div>
            <Link href="/" className="text-2xl font-black text-slate-800 tracking-tighter">
              NEST<span className="text-teal-500">.</span>
            </Link>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-700/80 hover:text-teal-600 transition-all font-semibold flex items-center gap-2 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full" />
              </Link>
            ))}

            {user ? (
              /* Logged-in: Owner Portal link (landlord only) + avatar dropdown */
              <div className="flex items-center gap-3">
                {user.role === 'landlord' && (
                  <Link href="/owner-portal">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px rgba(20, 184, 166, 0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg border border-teal-400/20 flex items-center gap-1.5"
                    >
                      <LayoutDashboard size={16} />
                      Owner Portal
                    </motion.button>
                  </Link>
                )}

                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUserMenu((p) => !p)}
                    className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
                  >
                    <User size={16} />
                    {user.name.split(' ')[0]}
                  </motion.button>

                  <AnimatePresence>
                    {userMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">{user.role}</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                        </div>
                        {user.role === 'landlord' && (
                          <Link href="/owner-portal" onClick={() => setUserMenu(false)}>
                            <div className="flex items-center gap-2 px-4 py-3 text-sm text-teal-600 font-bold hover:bg-teal-50 transition cursor-pointer">
                              <LayoutDashboard size={16} />
                              Owner Portal
                            </div>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 font-bold hover:bg-red-50 transition"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              /* Logged-out: Login + Sign Up */
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-1.5 text-slate-700 font-bold text-sm px-4 py-2 rounded-xl hover:bg-white/60 transition"
                  >
                    <LogIn size={16} />
                    Login
                  </motion.button>
                </Link>
                <Link href="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0px 0px 15px rgba(20, 184, 166, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg border border-teal-400/20 flex items-center gap-1.5"
                  >
                    <UserPlus size={16} />
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg bg-white/50 text-slate-800">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="opened"
            exit="closed"
            variants={menuVariants}
            className="md:hidden absolute top-20 left-0 w-full bg-white/80 backdrop-blur-2xl rounded-3xl p-6 border border-white/50 shadow-2xl flex flex-col gap-4"
          >
            {navLinks.map((link) => (
              <motion.div key={link.name} variants={itemVariants}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 text-slate-800 font-bold hover:bg-teal-500 hover:text-white transition-all"
                >
                  <span className="p-2 bg-white rounded-lg shadow-sm">{link.icon}</span>
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {user ? (
              <motion.div variants={itemVariants}>
                <div className="px-4 py-2 text-sm text-slate-500 font-semibold">
                  Signed in as <span className="text-teal-600">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 mt-1 bg-red-500 text-white py-4 rounded-2xl font-black shadow-xl"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </motion.div>
            ) : (
              <>
                <motion.div variants={itemVariants}>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 border-2 border-teal-500 text-teal-600 py-4 rounded-2xl font-black">
                      <LogIn size={18} />
                      Login
                    </button>
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-teal-400 text-white py-4 rounded-2xl font-black shadow-xl">
                      <UserPlus size={18} />
                      Sign Up
                    </button>
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;