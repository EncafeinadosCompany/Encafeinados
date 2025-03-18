// src/common/widgets/TeamSection.tsx
import React from 'react';
import { TeamCard } from '@/common/molecules/TeamCard';

const teamMembers = [
  { name: 'Santiago Florez Valencia', role: 'Frontend Developer', imageUrl: '/api/placeholder/100/100' },
  { name: 'Valentina Cordoba', role: 'Backend Developer', imageUrl: '/api/placeholder/100/100' },
  { name: 'Crony Lopez', role: 'UX Designer', imageUrl: '/api/placeholder/100/100' },
  { name: 'Deisy Zapata', role: 'Project Manager', imageUrl: '/api/placeholder/100/100' },
  { name: 'jose 👍', role: 'QA Engineer', imageUrl: '/api/placeholder/100/100' },
  { name: 'Juan pablo', role: 'DevOps Engineer', imageUrl: '/api/placeholder/100/100' },
  { name: 'Daniela Torres', role: 'Mobile Developer', imageUrl: '/api/placeholder/100/100' },
];

export const TeamSection = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <TeamCard members={teamMembers} />
      </div>
    </section>
  );
};