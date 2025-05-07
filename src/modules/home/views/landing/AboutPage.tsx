import React from "react";
import { Navbar } from "@/common/molecules/home/navbar";
import { Footer } from "@/common/widgets/home/Footer";
import { AboutSection } from "@/common/widgets/home/AboutSection";
import { TeamSection } from "@/common/widgets/home/TeamSection";

const AboutPage = () => {
  const aboutSections = [
    { name: "Sobre Nosotros", id: "about" },
    { name: "Nuestro Equipo", id: "team" },
  ];

  return (
    <main className="min-h-screen bg-[#FAF3E0] relative">
      <Navbar />
      <div className="">
        <section id="about">
          <AboutSection/>
        </section>
        <section id="team" className="w-full bg-[#FAF3E0]">
          <TeamSection />
        </section>
      </div>
      <Footer sections={aboutSections} />
    </main>
  );
};

export default AboutPage;
