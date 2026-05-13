'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const AnimatedNumber = ({ value }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = parseInt(value, 10);
            const duration = 2000;
            const incrementTime = Math.abs(Math.floor(duration / end));

            const timer = setInterval(() => {
                start += 1;
                setDisplayValue(start);
                if (start === end) clearInterval(timer);
            }, incrementTime);
            
            // Fallback for very large numbers to avoid long loops
            if(end > 500) {
               const fastTimer = setInterval(() => {
                  start += Math.ceil(end/50);
                  if (start >= end) {
                      setDisplayValue(end);
                      clearInterval(fastTimer);
                  } else {
                      setDisplayValue(start);
                  }
               }, 40);
               clearInterval(timer);
            }

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return <span ref={ref}>{displayValue}</span>;
};

const TrustBanner = () => {
    return (
        <section className="py-20 bg-teal-600 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-wrap justify-around gap-12 text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <h4 className="text-5xl font-black text-white drop-shadow-md">
                        <AnimatedNumber value="500" />+
                    </h4>
                    <p className="text-teal-100 font-bold uppercase text-xs tracking-widest mt-3">Verified Rooms</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <h4 className="text-5xl font-black text-white drop-shadow-md">
                        <AnimatedNumber value="1200" />+
                    </h4>
                    <p className="text-teal-100 font-bold uppercase text-xs tracking-widest mt-3">Happy Students</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <h4 className="text-5xl font-black text-white drop-shadow-md">
                        <AnimatedNumber value="15" />+
                    </h4>
                    <p className="text-teal-100 font-bold uppercase text-xs tracking-widest mt-3">Colleges Covered</p>
                </motion.div>
            </div>
        </section>
    );
};

export default TrustBanner;
