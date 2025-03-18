import React from 'react';
import { Card, CardContent } from '@/common/ui/card';
import { Avatar } from '@/common/ui/avatar';
import { Text } from '@/common/atoms/Text';
import { Separator } from '@/common/ui/separator';

interface TeamMember {
  name: string;
  role: string;
  imageUrl: string;
}

interface TeamCardProps {
  members: TeamMember[];
}

export const TeamCard = ({ members }: TeamCardProps) => {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg transition-all duration-300 bg-white">
      <CardContent className="p-6">
        <Text variant="h2" className="text-center mb-6 text-[#6F4E37]">Nuestro Equipo</Text>
        <Separator className="mb-6 bg-[#D4A76A]" />
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 justify-items-center">
          {members.slice(0, 4).map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <Avatar className="w-16 h-16 md:w-24 md:h-24 border-2 border-[#D4A76A]">
                <img src={member.imageUrl} alt={member.name} />
              </Avatar>
              <Text variant="p" className="text-center mt-2 font-medium text-[#2C1810]">{member.name}</Text>
              <Text variant="small" className="text-center text-[#6F4E37]">{member.role}</Text>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-4 md:mt-6 gap-4 md:gap-6">
          {members.slice(4).map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <Avatar className="w-16 h-16 md:w-24 md:h-24 border-2 border-[#D4A76A]">
                <img src={member.imageUrl} alt={member.name} />
              </Avatar>
              <Text variant="p" className="text-center mt-2 font-medium text-[#2C1810]">{member.name}</Text>
              <Text variant="small" className="text-center text-[#6F4E37]">{member.role}</Text>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};