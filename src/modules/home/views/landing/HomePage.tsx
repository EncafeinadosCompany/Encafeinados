import { HeroSection } from '@/common/widgets/home/HeroSection';
import { StoreCarousel } from '@/common/widgets/home/StoreCarousel';
import { BenefitsSection } from '@/common/widgets/home/BenefitsSection';
import { Footer } from '@/common/widgets/home/Footer';
import { MapTeaser } from '@/common/molecules/home/MapTeaser';
import { Navbar } from '@/common/molecules/home/navbar';

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#FAF3E0] relative overflow-hidden">
      <Navbar />
      <div className="relative z-5"> 
        <HeroSection />
        <MapTeaser totalCafes={45} city="Medellín" />
        <StoreCarousel />
        <BenefitsSection />
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;