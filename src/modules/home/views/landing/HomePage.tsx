import { HeroSection } from "@/common/widgets/home/HeroSection";
import { StoreCarousel } from "@/common/widgets/home/StoreCarousel";
import { BenefitsSection } from "@/common/widgets/home/BenefitsSection";
import { Footer } from "@/common/widgets/home/Footer";
import { MapTeaser } from "@/common/molecules/home/MapTeaser";
import { Navbar } from "@/common/molecules/home/navbar";

const HomePage = () => {
  const homeSections = [
    { name: 'Inicio', id: 'home' },
    { name: 'Mapa', id: 'map' },
    { name: 'Tiendas', id: 'stores' },
    { name: 'Beneficios', id: 'benefits' }
  ];

  return (
    <main className="min-h-screen bg-[#FAF3E0] relative overflow-x-hidden">
      <Navbar />
      <div className="relative">
        <section id="home" className="scroll-mt-20 min-h-screen">
          <HeroSection />
        </section>

        <section id="map" className="scroll-mt-20 min-h-[50vh]">
          <MapTeaser totalCafes={45} city="Medellín" />
        </section>

        <section id="stores" className="scroll-mt-20 min-h-[50vh]">
          <StoreCarousel />
        </section>

        <section id="benefits" className="scroll-mt-20 min-h-[50vh]">
          <BenefitsSection />
        </section>
      </div>
      <Footer sections={homeSections} />
    </main>
  );
};

export default HomePage;