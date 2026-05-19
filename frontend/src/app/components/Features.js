'use client';
import { motion } from 'framer-motion';
import { ShieldCheck, Map, Zap, Users } from 'lucide-react';
import Link from 'next/link';

const Features = () => {
  const cards = [
    { title: "Verified Listings", desc: "Every room is physically verified by our team for safety.", icon: <ShieldCheck className="text-teal-500" />, href: "/room" },
    { title: "Campus Guide", desc: "Find nearest hospitals, canteens, and pharmacies instantly.", icon: <Map className="text-orange-500" />, href: "/guide" },
    { title: "Instant Booking", desc: "Lock your room with a single click and digital receipts.", icon: <Zap className="text-yellow-500" />, href: "/room" },
    { title: "Roommate Finder", desc: "Match with students having similar study habits.", icon: <Users className="text-blue-500" />, href: "/roommate-finder" },
  ];

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <Link href={card.href} key={i}>
            <motion.div 
              whileHover={{ y: -10 }}
              style={{ willChange: "transform" }}
              className="p-8 rounded-3xl bg-white/50 border border-white shadow-lg hover:shadow-2xl transition-all cursor-pointer h-full"
            >
              <div className="w-12 h-12 rounded-2xl bg-white shadow-inner flex items-center justify-center mb-6">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">{card.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Features;