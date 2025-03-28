import React from 'react';
import { Navbar } from '@/common/molecules/home/navbar';
import { Footer } from '@/common/widgets/home/Footer';
import { AboutSection } from '@/common/widgets/home/AboutSection';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF3E0] relative overflow-hidden">
      <Navbar />
      <AboutSection />
      <Footer />
      <Footer />
    </main>
  );
};

export default AboutPage;