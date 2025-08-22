import React from 'react';
import { useCoffeeLoverProfile } from '@/api/queries/coffelovers/profile.query';
import { useUpdateProfileMutation } from '@/api/mutations/coffelover/profile.mutation';
import ProfileInfo from '@/common/molecules/coffeelover/profile/profile_info.molecule';
import FavoriteCafes from '@/common/molecules/coffeelover/profile/favorite_cafes.molecule';
import UserReviews from '@/common/molecules/coffeelover/profile/user_reviews.molecule';
import { Loader, User, Coffee, Star }  from "@/common/ui/icons"
import { useWindowSize } from '@/common/hooks/useWindowSize';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/common/ui/tabs';
import { getEncryptedItem } from '@/common/utils/security/storage_encrypted.utils';

export const ProfileWidget: React.FC = () => {
  const id = getEncryptedItem<string>('userId');
  const { data: profile, isLoading, error } = useCoffeeLoverProfile(id!);

  const updateProfile = useUpdateProfileMutation();
  const { height } = useWindowSize();

  const isLargeScreen = height > 800;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader className="h-8 w-8 text-[#DB8935] animate-spin mb-4" />
        <p className="text-[#8B5A2B] animate-pulse">Cargando perfil...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <div className="bg-red-50 rounded-full p-4 mb-4">
          <User className="h-8 w-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-red-700 mb-2">No se pudo cargar el perfil</h3>
        <p className="text-red-500 max-w-md">Ocurrió un error al cargar la información del perfil. Por favor, intenta nuevamente más tarde.</p>
      </div>
    );
  }

  const handleUpdateField = (field: string, value: string) => {
    updateProfile.mutate({ [field]: value });
  };

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-7xl bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header mejorado */}
      <header className="py-4 px-6 bg-gradient-to-r from-[#F8EDE3] to-[#FBF7F4] border-b border-[#E6D7C3]/30 flex items-center">
        <div className="bg-[#DB8935]/10 p-2 rounded-full mr-3">
          <User className="h-5 w-5 text-[#DB8935]" />
        </div>
        <h1 className="text-xl font-semibold text-[#5F4B32]">Mi perfil</h1>
        {updateProfile.isPending && (
          <div className="ml-auto flex items-center text-[#8B5A2B] text-sm">
            <Loader className="h-3 w-3 animate-spin mr-2" />
            Guardando...
          </div>
        )}
      </header>

      <ProfileInfo
        profile={profile}
        onUpdateField={handleUpdateField}
        isLoading={updateProfile.isPending}
      />

      {/* Contenido con tabs para móvil y vista normal para pantallas grandes */}
      {isLargeScreen ? (
        <div className="flex-grow flex flex-col p-4 space-y-6">
          <div className="flex-grow">
            <FavoriteCafes heightAdjustment={isLargeScreen} />
          </div>
          <div>
            <UserReviews heightAdjustment={isLargeScreen} />
          </div>
        </div>
      ) : (
        <div className="flex-grow p-4">
          <Tabs defaultValue="favorites" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="favorites" className="flex items-center justify-center">
                <Coffee className="h-4 w-4 mr-2" />
                 Favoritos
              </TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center justify-center">
                <Star className="h-4 w-4 mr-2" />
                Mis reseñas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="favorites">
              <FavoriteCafes heightAdjustment={false} />
            </TabsContent>
            <TabsContent value="reviews">
              <UserReviews heightAdjustment={false} />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ProfileWidget;