import React, { useState, useEffect } from 'react';
import { X, Check, User, Mail, Phone, FileText, Loader } from 'lucide-react';
import { CoffeeLoverProfile } from '@/api/types/coffelovers/coffelovers.type';

interface EditProfileModalProps {
  profile: CoffeeLoverProfile;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSave: (data: { full_name: string; user_email: string; phone_number: string }) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  profile,
  isOpen,
  isLoading,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    full_name: profile.person.full_name,
    user_email: profile.person.user_email,
    phone_number: profile.person.phone_number || ''
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: profile.person.full_name,
        user_email: profile.person.user_email,
        phone_number: profile.person.phone_number || ''
      });
    }
  }, [isOpen, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-lg w-full max-w-sm shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-[#E6D7C3] flex justify-between items-center">
          <h3 className="font-medium text-[#5F4B32] text-lg flex items-center">
            <User className="h-5 w-5 mr-2 text-[#DB8935]" />
            Editar perfil
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label htmlFor="full_name" className=" text-sm font-medium text-[#5F4B32] mb-1 flex items-center">
              <User className="h-4 w-4 mr-1 text-[#DB8935]" />
              Nombre completo
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full p-2 border border-[#E6D7C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB8935]/30 focus:border-[#DB8935] transition-all"
              required
            />
          </div>
          
          <div>
            <label htmlFor="user_email" className=" text-sm font-medium text-[#5F4B32] mb-1 flex items-center">
              <Mail className="h-4 w-4 mr-1 text-[#DB8935]" />
              Correo electrónico
            </label>
            <input
              type="email"
              id="user_email"
              name="user_email"
              value={formData.user_email}
              onChange={handleChange}
              className="w-full p-2 border border-[#E6D7C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB8935]/30 focus:border-[#DB8935] transition-all"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone_number" className=" text-sm font-medium text-[#5F4B32] mb-1 flex items-center">
              <Phone className="h-4 w-4 mr-1 text-[#DB8935]" />
              Teléfono
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Ej. 3001234567"
              className="w-full p-2 border border-[#E6D7C3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB8935]/30 focus:border-[#DB8935] transition-all"
            />
          </div>
          
          <div>
            <label className=" text-sm font-medium text-[#5F4B32] mb-1 flex items-center">
              <FileText className="h-4 w-4 mr-1 text-[#DB8935]" />
              Documento
            </label>
            <div className="p-2 bg-gray-50 border border-[#E6D7C3] rounded-lg text-gray-500 text-sm flex items-center">
              <span className="bg-[#DB8935]/10 text-[#5F4B32] text-xs font-semibold px-2 py-0.5 rounded mr-2">
                {profile.person.type_document}
              </span>
              {profile.person.number_document}
            </div>
          </div>
        
          <div className="pt-4 border-t border-[#E6D7C3] flex justify-end mt-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#E6D7C3] text-[#5F4B32] rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#DB8935] text-white px-4 py-2 rounded-lg hover:bg-[#C67925] transition-colors flex items-center shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    Guardar
                    <Check size={16} className="ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;