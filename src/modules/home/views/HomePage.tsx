import React from 'react';
import { HeroSection } from '@/common/widgets/HeroSection';
import { StoreCarousel } from '@/common/widgets/StoreCarousel';
import { TeamSection } from '@/common/widgets/TeamSection';
import { BenefitsSection } from '@/common/widgets/BenefitsSection';
import { AboutSection } from '@/common/widgets/AboutSection';

const stores = [
  { id: 1, name: 'Café del Bosque', imageUrl: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 2, name: 'Pergamino Café', imageUrl: 'https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 3, name: 'Velvet Café', imageUrl: 'https://images.pexels.com/photos/894695/pexels-photo-894695.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 4, name: 'Café Revolución', imageUrl: 'https://images.pexels.com/photos/885021/pexels-photo-885021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 5, name: 'Al Alma Café', imageUrl: 'https://images.pexels.com/photos/129207/pexels-photo-129207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 6, name: 'Urbania Café', imageUrl: 'https://images.pexels.com/photos/2396220/pexels-photo-2396220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

export const HomePage = () => {
  return (
    <main className="min-h-screen bg-[#FAF3E0]">
      <HeroSection />
      <StoreCarousel stores={stores} />
      <BenefitsSection />
      <TeamSection />
      <AboutSection />
    </main>
  );
};