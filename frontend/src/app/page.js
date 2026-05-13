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
import TrustBanner from './components/TrustBanner';
import HowItWorks from './components/HowItWorks';
import CTA from './components/CTA';

export default function Home() {
  return (
    <main className="bg-slate-50">
      {/* 1. Impactful Intro */}
      <Hero />

      {/* 2. How It Works - Guide for new users */}
      <HowItWorks />

      {/* 3. Interactive Sliding Gallery */}
      <RoomSlider />

      {/* 4. Feature Showcase */}
      <Features />

      {/* 5. Trust Banner (Animated Stats Section) */}
      <TrustBanner />

      {/* 6. Call To Action for Landlords */}
      <CTA />
    </main>
  );
}