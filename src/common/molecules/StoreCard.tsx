import React from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Text } from '@/common/atoms/Text';

interface StoreCardProps {
  name: string;
  imageUrl: string;
}

export const StoreCard = ({ name, imageUrl }: StoreCardProps) => {
  return (
    <Card className="w-64 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="h-40 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-4 bg-white">
          <Text variant="h3" className="text-xl text-[#2C1810]">{name}</Text>
        </div>
      </CardContent>
    </Card>
  );
};