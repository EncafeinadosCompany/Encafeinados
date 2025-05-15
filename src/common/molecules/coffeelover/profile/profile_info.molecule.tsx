import React, { useState } from 'react';
import { User, Coffee, Edit, X, Check, ChevronRight } from 'lucide-react';
import { CoffeeLoverProfile } from '@/api/types/coffelovers/coffelovers.type';

interface ProfileInfoProps {
  profile: CoffeeLoverProfile;
  onUpdateField: (field: string, value: string) => void;
  isLoading: boolean;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  profile, 
  onUpdateField,
  isLoading 
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.person.full_name,
    user_email: profile.person.user_email,
    phone_number: profile.person.phone_number || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Solo actualizar los campos que han cambiado
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
    <div className="p-4">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div 
            className="relative bg-[#f8ece0] rounded-lg w-16 h-16 flex items-center justify-center cursor-pointer"
            onClick={() => setIsEditMode(true)}
          >
            {profile.person.full_name.charAt(0).toUpperCase()}
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
              <Edit className="w-4 h-4 text-[#DB8935]" />
            </div>
            
            {/* Coffee coins badge */}
            <div className="absolute -top-1 -right-1 bg-[#DB8935] text-white text-xs font-medium px-1.5 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
              <Coffee className="h-2.5 w-2.5" />
              <span>{profile.coffee_coins}</span>
            </div>
          </div>
          
          <div className="flex flex-col">
            <h1 className="font-medium text-lg text-[#5F4B32]">
              {profile.person.full_name}
            </h1>
            <p className="text-sm text-[#8B5A2B]">
              {profile.person.user_email}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {profile.person.type_document} {profile.person.number_document}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditMode && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-medium text-[#5F4B32]">Editar perfil</h3>
              <button 
                onClick={() => setIsEditMode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-[#5F4B32] mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E6D7C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#DB8935]"
                />
              </div>
              
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-[#5F4B32] mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="user_email"
                  name="user_email"
                  value={formData.user_email}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E6D7C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#DB8935]"
                />
              </div>
              
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-[#5F4B32] mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="w-full p-2 border border-[#E6D7C3] rounded-md focus:outline-none focus:ring-1 focus:ring-[#DB8935]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#5F4B32] mb-1">
                  Documento
                </label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-gray-500 text-sm">
                  {profile.person.type_document} {profile.person.number_document}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-end">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-[#DB8935] text-white px-4 py-2 rounded-md hover:bg-[#C67925] transition-colors flex items-center"
              >
                {isLoading ? 'Guardando...' : 'Guardar cambios'}
                {!isLoading && <Check size={16} className="ml-1" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;