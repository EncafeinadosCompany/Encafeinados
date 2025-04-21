import React from 'react';
import { Navbar } from '@/common/molecules/home/navbar';
import { Footer } from '@/common/widgets/home/Footer';
import { AboutSection } from '@/common/widgets/home/AboutSection';
import { TeamSection } from '@/common/widgets/home/TeamSection';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-[#FAF3E0] relative">
      <Navbar />
      
      <div className=""> 
        <AboutSection />
        <div className=" bg-[#FAF3E0]"></div>
        <div id="team-container" className="w-full bg-[#FAF3E0]">
          <TeamSection />
        </div>
        
        <div className="bg-[#FAF3E0]"></div>
      </div>
      <Footer />
    </main>
  );
};

export default AboutPage;