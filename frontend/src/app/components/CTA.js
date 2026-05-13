'use client';
import { motion } from 'framer-motion';
import { ArrowRight, Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const CTA = () => {
    const { user } = useAuth();
    const router = useRouter();

    const handleCtaClick = () => {
        if (user) {
            // Already logged in, go to owner portal / registration form
            router.push('/owner-portal');
        } else {
            // Not logged in, send to signup/login
            router.push('/login');
        }
    };

    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="max-w-xl relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-teal-300 text-xs font-bold tracking-widest uppercase mb-6">
                            <Building2 size={14} /> For Landlords
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            Have a property to <span className="text-teal-400">rent out?</span>
                        </h2>
                        <p className="text-slate-300 text-lg font-medium mb-0">
                            Join SRAP and list your property. Reach thousands of verified students looking for their next home. Fast, secure, and hassle-free.
                        </p>
                    </div>

                    <div className="relative z-10 shrink-0">
                        <motion.button 
                            onClick={handleCtaClick}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-teal-500 hover:bg-teal-400 text-slate-900 px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-colors shadow-[0_0_40px_rgba(20,184,166,0.3)]"
                        >
                            List Your Property
                            <ArrowRight size={20} />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTA;
