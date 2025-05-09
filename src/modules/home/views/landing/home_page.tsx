import { HeroSection } from "@/common/widgets/home/hero_section.widget";
import { StoreCarousel } from "@/common/widgets/home/store_carousel.widget";
import { BenefitsSection } from "@/common/widgets/home/benefits_section.widget";
import { Footer } from "@/common/widgets/home/footer.widget";
import { MapTeaser } from "@/common/molecules/home/map_teaser.molecule";
import { Navbar } from "@/common/molecules/home/navbar.molecule";
import { useApprovedBranches } from "@/api/queries/branches/branch.query";


const HomePage = () => {
  const homeSections = [
    { name: 'Inicio', id: 'home' },
    { name: 'Mapa', id: 'map' },
    { name: 'Tiendas', id: 'stores' },
    { name: 'Beneficios', id: 'benefits' }
  ];


  const {data} = useApprovedBranches();

  return (
    <main className="min-h-screen bg-[#FAF3E0] relative overflow-x-hidden">
      <Navbar />
      <div className="relative">
        <section id="home" className="scroll-mt-20 min-h-screen">
          <HeroSection />
        </section>

        <section id="map" className="scroll-mt-20 min-h-[50vh]">
          <MapTeaser totalCafes={data?.length|| 0} city="Medellín" />
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