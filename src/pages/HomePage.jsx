import React from 'react';
import Navbar from '../components/common/Navbar';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import HowItWorks from '../components/home/HowItWorks';
import FinalCta from '../components/home/FinalCta';
import Footer from '../components/common/Footer';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
