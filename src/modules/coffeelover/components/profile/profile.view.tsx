import React from 'react';
import ProfileWidget from '@/common/widgets/coffeelover/profile/profile.widget';
import { CoffeeBackground } from '@/common/widgets/coffee_background.widget';
import { useAppData } from '@/common/context/AppDataContext';

const ProfileView: React.FC = () => {
  const { isMobile } = useAppData();
  
  return (
    <div className="relative h-screen">
      <CoffeeBackground 
        coffeeCount={10} 
        circleCount={6}
        opacity={70} 
        zIndex={0}
        gradientFrom="#FFFDF9"
        gradientTo="#FAF3E0"
      />
      
      <div className={`absolute inset-0 overflow-y-auto overflow-x-hidden z-10 ${isMobile ? 'pb-16' : ''}`}>
        <ProfileWidget />
      </div>
    </div>
  );
};

export default ProfileView;