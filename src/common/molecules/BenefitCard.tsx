import React from 'react';
import { Text } from '@/common/atoms/Text';
import { Card, CardContent } from '@/common/ui/card';

interface BenefitCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const BenefitCard = ({ title, description, icon }: BenefitCardProps) => {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300 bg-[#FAF3E0]">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="text-[#6F4E37] mb-4 text-3xl">
          {icon}
        </div>
        <Text variant="h3" className="text-xl mb-2 text-[#2C1810]">{title}</Text>
        <Text variant="p" className="text-[#6F4E37]">{description}</Text>
      </CardContent>
    </Card>
  );
};