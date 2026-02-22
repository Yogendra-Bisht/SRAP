'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 pt-20 pb-10 overflow-hidden">
      {/* Foggy Background Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-teal-500 p-1.5 rounded-lg shadow-lg">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tighter">NEST.</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Revolutionizing student living by providing verified, comfortable, 
              and affordable housing near major college campuses.
            </p>
            <div className="flex gap-4">
              {[Github, Linkedin, Mail].map((Icon, i) => (
                <motion.a 
                  key={i}
                  href="#" 
                  whileHover={{ y: -3, color: '#14b8a6' }}
                  className="text-slate-500 transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-medium">
              {['Find Rooms', 'Campus Guide', 'Owner Portal', 'Roommate Finder'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-slate-400 hover:text-teal-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-teal-500" />
                <span>CSE Dept, University Campus</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-teal-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-teal-500" />
                <span>support@nest.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Call to Action */}
          <div>
            <h4 className="text-white font-bold mb-6">Stay Updated</h4>
            <p className="text-slate-400 text-sm mb-4">Get the latest room listings in your inbox.</p>
            <div className="flex flex-col gap-2">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
              <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all active:scale-95">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500 tracking-widest uppercase">
          <p>© {currentYear} NEST - ALL RIGHTS RESERVED</p>
          <div className="flex gap-6">
            <span>Yogendra Singh</span>
            <span>Vijay Singh Rawat</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;