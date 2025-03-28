import { HeroSection } from '@/common/widgets/home/HeroSection';
import { StoreCarousel } from '@/common/widgets/home/StoreCarousel';
// import { TeamSection } from '@/common/widgets/home/TeamSection';
import { BenefitsSection } from '@/common/widgets/home/BenefitsSection';

import { Footer } from '@/common/widgets/home/Footer';
import { MapTeaser } from '@/common/molecules/home/MapTeaser';

const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#FAF3E0] relative overflow-hidden">

      <div className="relative z-5">
        <HeroSection />
        <MapTeaser totalCafes={45} city="Medellín" />
        
        <StoreCarousel />
        <BenefitsSection />
        {/* <TeamSection /> */}
        {/* <AboutSection /> */}
        <Footer />
        
      </div>
    </main>
  );
};

export default HomePage;