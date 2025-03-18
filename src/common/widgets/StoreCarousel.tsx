// src/common/widgets/StoreCarousel.tsx
import React from 'react';
import { Text } from '@/common/atoms/Text';
import { StoreCard } from '@/common/molecules/StoreCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/common/ui/carousel";

interface Store {
  id: number;
  name: string;
  imageUrl: string;
}

interface StoreCarouselProps {
  stores: Store[];
}

export const StoreCarousel = ({ stores }: StoreCarouselProps) => {
  return (
    <section className="py-12 px-4 bg-[#FAF3E0]">
      <div className="max-w-7xl mx-auto">
        <Text variant="h2" className="text-center mb-8 text-[#6F4E37]">Tiendas Aliadas</Text>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {stores.map((store) => (
              <CarouselItem key={store.id} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <StoreCard name={store.name} imageUrl={store.imageUrl} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4">
            <CarouselPrevious className="static translate-x-0 translate-y-0 mr-2" />
            <CarouselNext className="static translate-x-0 translate-y-0 ml-2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};