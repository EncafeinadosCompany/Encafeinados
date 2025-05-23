import React, { useState } from 'react';
import { Coffee, Edit, Mail, Phone } from 'lucide-react';
import { CoffeeLoverProfileType} from '@/api/types/coffelovers/coffelovers.type';
import EditProfileModal from './edit_profile_modal.molecule';

interface ProfileInfoProps {
  profile: CoffeeLoverProfileType;
  onUpdateField: (field: string, value: string) => void;
  isLoading: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  profile, 
  onUpdateField,
  isLoading 
}) => {
  const [isEditMode, setIsEditMode] = useState(false);

  const handleSave = (formData: { full_name: string; user_email: string; phone_number: string }) => {
    if (formData.full_name !== profile.person.full_name) {
      onUpdateField('full_name', formData.full_name);
    }
    if (formData.user_email !== profile.person.user_email) {
      onUpdateField('user_email', formData.user_email);
    }
    if (formData.phone_number !== profile.person.phone_number) {
      onUpdateField('phone_number', formData.phone_number);
    }
    
    setIsEditMode(false);
  };

  return (
    <div className="p-4 border-b border-[#E6D7C3]/30">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div 
            className="relative bg-[#f8ece0] rounded-lg w-16 h-16 flex items-center justify-center text-[#5F4B32] font-semibold text-xl cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            onClick={() => setIsEditMode(true)}
          >
          <Edit className="w-4 h-4 text-[#DB8935]" />

            
            {/* Coffee coins badge */}
            <div className="absolute -top-1 -right-1 bg-[#DB8935] text-white text-xs font-medium px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
              <Coffee className="h-2.5 w-2.5" />
              <span>{profile.coffee_coins}</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <h1 className="font-medium text-lg text-[#5F4B32]">
              {profile.person.full_name}
            </h1>
            <p className="text-sm text-[#8B5A2B] flex items-center mt-0.5">
              <Mail className="h-3 w-3 mr-1" />
              {profile.person.user_email}
            </p>
            {profile.person.phone_number && (
              <p className="text-sm text-[#8B5A2B] flex items-center mt-0.5">
                <Phone className="h-3 w-3 mr-1" />
                {profile.person.phone_number}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Modal de edición separado */}
      <EditProfileModal
        profile={profile}
        isOpen={isEditMode}
        isLoading={isLoading}
        onClose={() => setIsEditMode(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProfileInfo;