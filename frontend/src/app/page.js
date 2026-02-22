// import { M_PLUS_1 } from "next/font/google";
// import Image from "next/image";
// import Hero from "./components/Hero";

// export default function Home() {
//   return (
//     <>
//     <Hero/>
//     </>
//   );
// }
import Hero from './components/Hero';
import RoomSlider from './components/RoomSlider';
import Features from './components/Features';

export default function Home() {
  return (
    <main className="bg-slate-50">
      {/* 1. Impactful Intro */}
      <Hero />

      {/* 2. Interactive Sliding Gallery */}
      <RoomSlider />

      {/* 3. Feature Showcase */}
      <Features />

      {/* 4. Trust Banner (Quick Stat Section) */}
      <section className="py-16 bg-teal-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-8 text-center">
          <div>
            <h4 className="text-4xl font-black text-white">500+</h4>
            <p className="text-teal-100 font-bold uppercase text-xs tracking-widest mt-2">Verified Rooms</p>
          </div>
          <div>
            <h4 className="text-4xl font-black text-white">1200+</h4>
            <p className="text-teal-100 font-bold uppercase text-xs tracking-widest mt-2">Happy Students</p>
          </div>
          <div>
            <h4 className="text-4xl font-black text-white">15+</h4>
            <p className="text-teal-100 font-bold uppercase text-xs tracking-widest mt-2">Colleges Covered</p>
          </div>
        </div>
      </section>

      {/* 5. Footer Placeholder */}
      {/* <footer className="py-20 bg-slate-900 text-slate-400 text-center">
        <p className="font-bold text-white mb-2">Student Room Accommodation Platform</p>
        <p className="text-sm">Final Year Project - CSE Department</p>
      </footer> */}
    </main>
  );
}