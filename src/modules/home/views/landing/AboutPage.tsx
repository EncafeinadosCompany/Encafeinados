import React from 'react';
import { Navbar } from '@/common/molecules/home/navbar';
import { Footer } from '@/common/widgets/home/Footer';
import { AboutSection } from '@/common/widgets/home/AboutSection';
import { TeamSection } from '@/common/widgets/home/TeamSection';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF3E0] relative overflow-y-auto  pt-5">
      <Navbar />
      
      <AboutSection />
      <TeamSection />
      <Footer />
    </main>
  );
};

export default AboutPage;