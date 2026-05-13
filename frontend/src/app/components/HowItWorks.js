'use client';
import { motion } from 'framer-motion';
import { Search, CalendarCheck, Home } from 'lucide-react';

const steps = [
    {
        icon: <Search className="text-teal-600" size={32} />,
        title: "Search & Filter",
        desc: "Find rooms near your campus with our advanced filters for price, amenities, and more."
    },
    {
        icon: <CalendarCheck className="text-teal-600" size={32} />,
        title: "Schedule a Visit",
        desc: "Book a physical or virtual tour to verify the room and meet the landlord."
    },
    {
        icon: <Home className="text-teal-600" size={32} />,
        title: "Lock & Move In",
        desc: "Secure your room instantly through our platform and move into your new home."
    }
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
                    >
                        How It <span className="text-teal-600">Works</span>
                    </motion.h2>
                    <p className="text-lg text-slate-500 font-medium">Your journey to the perfect room in 3 simple steps</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-[2px] bg-teal-100 z-0 border-t-2 border-dashed border-teal-200"></div>

                    {steps.map((step, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center"
                        >
                            <div className="w-24 h-24 bg-white rounded-3xl shadow-xl shadow-teal-900/5 flex items-center justify-center mb-8 border border-teal-50">
                                {step.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-3">{step.title}</h3>
                            <p className="text-slate-600 font-medium leading-relaxed max-w-sm">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
