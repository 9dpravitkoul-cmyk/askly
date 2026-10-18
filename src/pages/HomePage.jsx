import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import InteractivePreviews from '../components/home/InteractivePreviews';
import FinalCta from '../components/home/FinalCta';
import Footer from '../components/common/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <InteractivePreviews />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
