'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Map, Search, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: <Home size={18} /> },
    { name: 'Find Rooms', href: '/rooms', icon: <Search size={18} /> },
    { name: 'Campus Guide', href: '/guide', icon: <Map size={18} /> },
  ];

  // Variants for Framer Motion Animations
  const menuVariants = {
    closed: { opacity: 0, y: -20, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    opened: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.2 } }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    opened: { opacity: 1, x: 0 }
  };

  return (
    <nav className="fixed w-[95%] left-1/2 -translate-x-1/2 top-4 z-50 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo with Sparkle Icon */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex items-center gap-2"
          >
            <div className="bg-teal-500 p-1.5 rounded-lg shadow-lg">
               <Sparkles size={20} className="text-white" />
            </div>
            <Link href="/" className="text-2xl font-black text-slate-800 tracking-tighter">
              NEST<span className="text-teal-500">.</span>
            </Link>
          </motion.div>

          {/* Desktop Nav - Foggy Text Style */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-slate-700/80 hover:text-teal-600 transition-all font-semibold flex items-center gap-2 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
            
            <Link href="/owner-portal">
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0px 0px 15px rgba(20, 184, 166, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg border border-teal-400/20"
              >
                Owner Portal
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 rounded-lg bg-white/50 text-slate-800"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Animated Mobile Menu Overlay */}
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
                  <span className="p-2 bg-white rounded-lg shadow-sm group-hover:bg-teal-400">
                    {link.icon}
                  </span>
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div variants={itemVariants}>
                <Link href="/owner-portal" onClick={() => setIsOpen(false)}>
                    <button className="w-full mt-2 bg-gradient-to-r from-teal-600 to-teal-400 text-white py-4 rounded-2xl font-black shadow-xl">
                        OWNER PORTAL
                    </button>
                </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;