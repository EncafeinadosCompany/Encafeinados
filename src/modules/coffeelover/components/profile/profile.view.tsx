import React from 'react';
import ProfileWidget from '@/common/widgets/coffeelover/profile/profile.widget';
import { useWindowSize } from '@/common/hooks/useWindowSize';

const ProfileView: React.FC = () => {
  const { height } = useWindowSize();
  
  const viewClass = height > 800 
    ? "min-h-screen flex flex-col justify-between" 
    : "min-h-screen";
  
  return (
    <div className={`bg-[#FBF7F4] ${viewClass}`}>
      <ProfileWidget />
    </div>
  );
};

export default ProfileView;