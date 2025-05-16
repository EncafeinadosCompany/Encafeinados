import React from 'react';
import ProfileWidget from '@/common/widgets/coffeelover/profile/profile.widget';
import { useWindowSize } from '@/common/hooks/useWindowSize';
import { CoffeeBackground } from '@/common/widgets/coffee_background.widget';

const ProfileView: React.FC = () => {
  const { height } = useWindowSize();
  
  // Ya no necesitamos esta variable, ya que implementaremos scroll
  // const viewClass = height > 800 
  //   ? "min-h-screen flex flex-col justify-between" 
  //   : "min-h-screen";
  
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
      
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden z-10">
        <ProfileWidget />
      </div>
    </div>
  );
};

export default ProfileView;