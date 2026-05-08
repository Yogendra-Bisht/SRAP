'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Github, Linkedin, Mail, MapPin, Phone, ChevronUp, Play, Smartphone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 pt-20 pb-10 overflow-hidden">
      {/* Foggy Background Glow */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 blur-[120px] rounded-full translate-y-1/4 -translate-x-1/4 pointer-events-none"></div>
      
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
              {[
                { Icon: Github, href: "https://github.com/Yogendra-Bisht" },
                { Icon: Linkedin, href: "https://www.linkedin.com/in/yogendra-bisht-7b4b63288" },
                { Icon: Mail, href: "mailto:support@nest.com" }
              ].map(({ Icon, href }, i) => (
                <motion.a 
                  key={i}
                  href={href} 
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, color: '#14b8a6' }}
                  className="text-slate-500 transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>

            {/* App Download Badges */}
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white px-3 py-2 rounded-xl transition-colors border border-slate-700 group">
                <Play size={18} className="text-slate-400 group-hover:text-teal-400 transition-colors" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 leading-none">Get it on</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </button>
              <button className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 text-white px-3 py-2 rounded-xl transition-colors border border-slate-700 group">
                <Smartphone size={18} className="text-slate-400 group-hover:text-teal-400 transition-colors" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 leading-none">Download on the</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { name: 'Find Rooms', href: '/rooms' },
                { name: 'Campus Guide', href: '/guide' },
                { name: 'Owner Portal', href: '/owner' },
                { name: 'Roommate Finder', href: '/roommates' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="group inline-flex items-center text-slate-400 hover:text-teal-400 transition-colors">
                    <span className="relative">
                      {item.name}
                      <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-400 transition-all duration-300 group-hover:w-full"></span>
                    </span>
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
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
              />
              <button className="bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold py-3 rounded-xl transition-all active:scale-95 shadow-[0_0_15px_rgba(20,184,166,0.2)] hover:shadow-[0_0_25px_rgba(20,184,166,0.4)]">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-slate-500 tracking-widest uppercase">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>© {currentYear} NEST</p>
            <div className="w-1 h-1 rounded-full bg-slate-700 hidden md:block"></div>
            <div className="flex items-center gap-2 group cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-slate-400 normal-case tracking-normal group-hover:text-teal-400 transition-colors">All systems operational</span>
            </div>
          </div>
          
          <div className="flex gap-6 items-center">
            <span>Yogendra Singh</span>
            <span>Vijay Singh Rawat</span>
            
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="ml-2 p-2.5 bg-slate-800 hover:bg-teal-500 text-slate-400 hover:text-white rounded-xl transition-all hover:-translate-y-1"
              aria-label="Back to top"
            >
              <ChevronUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;