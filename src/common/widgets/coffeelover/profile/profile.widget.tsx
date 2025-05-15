import React from 'react';
import { useCoffeeLoverProfile } from '@/api/queries/coffelovers/profile.query';
import { useUpdateProfileMutation } from '@/api/mutations/coffelover/profile.mutation';
import ProfileInfo from '@/common/molecules/coffeelover/profile/profile_info.molecule';
import FavoriteCafes from '@/common/molecules/coffeelover/profile/favorite_cafes.molecule';
import UserReviews from '@/common/molecules/coffeelover/profile/user_reviews.molecule';
import { Loader, User } from 'lucide-react';
import { useWindowSize } from '@/common/hooks/useWindowSize';

export const ProfileWidget: React.FC = () => {
  const { data: profile, isLoading, error } = useCoffeeLoverProfile();
  const updateProfile = useUpdateProfileMutation();
  const { height } = useWindowSize();
  
  // Para ajustar espaciado basado en la altura de la pantalla
  const isLargeScreen = height > 800;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Loader className="h-8 w-8 text-[#DB8935] animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">No se pudo cargar la información del perfil</p>
      </div>
    );
  }

  const handleUpdateField = (field: string, value: string) => {
    updateProfile.mutate({ [field]: value });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Nuevo header de perfil */}
      <header className="py-3 px-4 bg-[#FBF7F4] border-b border-[#E6D7C3]/30 flex items-center">
        <User className="h-5 w-5 text-[#DB8935] mr-2" />
        <h1 className="text-lg font-semibold text-[#5F4B32]">Mi perfil</h1>
      </header>
      
      <ProfileInfo 
        profile={profile} 
        onUpdateField={handleUpdateField} 
        isLoading={updateProfile.isPending} 
      />
      
      <div className={`flex-grow flex flex-col ${isLargeScreen ? 'justify-between' : ''}`}>
        <div className={isLargeScreen ? 'flex-grow' : ''}>
          <FavoriteCafes heightAdjustment={isLargeScreen} />
        </div>
        
        <div>
          <UserReviews heightAdjustment={isLargeScreen} />
        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;