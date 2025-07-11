import React, { useState, useEffect } from 'react';
import { X, Check, User, Mail, Phone, FileText,Loader, Coffee, AlertCircle } from'@/common/ui/icons'
import { CoffeeLoverProfileType } from '@/api/types/coffelovers/coffelovers.type';

interface EditProfileModalProps {
  profile: CoffeeLoverProfileType;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSave: (data: { full_name: string; email: string; phone_number: string }) => void;
}

interface FormErrors {
  full_name?: string;
  email?: string;
  phone_number?: string;
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
    email: profile.person.user_email, 
    phone_number: profile.person.phone_number || ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: profile.person.full_name,
        email: profile.person.user_email, 
        phone_number: profile.person.phone_number || ''
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen, profile]);

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'full_name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (value.trim().length > 50) return 'El nombre no puede exceder 50 caracteres';
        if (!/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$/.test(value.trim())) return 'El nombre solo puede contener letras y espacios';
        return undefined;

      case 'email':
        if (!value.trim()) return 'El correo es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Ingrese un correo válido';
        return undefined;

      case 'phone_number':
        if (value && !/^[0-9+\-\s()]+$/.test(value)) return 'Formato de teléfono inválido';
        if (value && value.replace(/[^0-9]/g, '').length < 7) return 'El teléfono debe tener al menos 7 dígitos';
        if (value && value.replace(/[^0-9]/g, '').length > 15) return 'El teléfono no puede tener más de 15 dígitos';
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        newErrors[key as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched({ full_name: true, email: true, phone_number: true });
    return isValid;
  };

  const hasChanges = () => {
    return (
      formData.full_name !== profile.person.full_name ||
      formData.email !== profile.person.user_email ||
      formData.phone_number !== (profile.person.phone_number || '')
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && hasChanges()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  const isFormValid = Object.values(errors).every(error => !error);
  const canSubmit = isFormValid && hasChanges() && !isLoading;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-[#FBF7F4] rounded-2xl w-full max-w-md shadow-2xl border border-[#E6D7C3]/30 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-[#6F4E37] to-[#5D3D26] px-6 py-4">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/15 p-2.5 rounded-full">
                <Coffee className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Editar Perfil</h3>
                <p className="text-white/70 text-sm">Mantén tu información actualizada</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white rounded-full p-2 hover:bg-white/10 transition-all duration-200"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label htmlFor="full_name" className="text-sm font-medium text-[#2C1810] flex items-center gap-2">
              <div className="bg-[#DB8935]/10 p-1 rounded-full">
                <User className="h-3.5 w-3.5 text-[#DB8935]" />
              </div>
              Nombre completo
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-white/70 border rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#DB8935]/30 text-[#2C1810]
                placeholder:text-[#5F4B32]/50 hover:border-[#DB8935]/30
                ${errors.full_name 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200' 
                  : 'border-[#E6D7C3]/50 focus:border-[#DB8935]'
                }`}
              placeholder="Ingresa tu nombre completo"
              required
            />
            {errors.full_name && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.full_name}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-[#2C1810] flex items-center gap-2">
              <div className="bg-[#DB8935]/10 p-1 rounded-full">
                <Mail className="h-3.5 w-3.5 text-[#DB8935]" />
              </div>
              Correo electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 bg-white/70 border rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#DB8935]/30 text-[#2C1810]
                placeholder:text-[#5F4B32]/50 hover:border-[#DB8935]/30
                ${errors.email 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200' 
                  : 'border-[#E6D7C3]/50 focus:border-[#DB8935]'
                }`}
              placeholder="ejemplo@correo.com"
              required
            />
            {errors.email && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="phone_number" className="text-sm font-medium text-[#2C1810] flex items-center gap-2">
              <div className="bg-[#DB8935]/10 p-1 rounded-full">
                <Phone className="h-3.5 w-3.5 text-[#DB8935]" />
              </div>
              Teléfono <span className="text-[#5F4B32]/50 text-xs">(opcional)</span>
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Ej. +57 300 123 4567"
              className={`w-full px-4 py-3 bg-white/70 border rounded-xl transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#DB8935]/30 text-[#2C1810]
                placeholder:text-[#5F4B32]/50 hover:border-[#DB8935]/30
                ${errors.phone_number 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200' 
                  : 'border-[#E6D7C3]/50 focus:border-[#DB8935]'
                }`}
            />
            {errors.phone_number && (
              <div className="flex items-center gap-1.5 text-red-600 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>{errors.phone_number}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#2C1810] flex items-center gap-2">
              <div className="bg-[#DB8935]/10 p-1 rounded-full">
                <FileText className="h-3.5 w-3.5 text-[#DB8935]" />
              </div>
              Documento de identidad
            </label>
            <div className="px-4 py-3 bg-[#F5E4D2]/20 border border-[#E6D7C3]/30 rounded-xl flex items-center gap-3">
              <span className="bg-[#6F4E37] text-white text-xs font-medium px-3 py-1 rounded-full">
                {profile.person.type_document}
              </span>
              <span className="text-[#2C1810] font-medium">{profile.person.number_document}</span>
            </div>
            <p className="text-xs text-[#5F4B32]/60 flex items-center gap-1.5">
              <span className="w-1 h-1 bg-[#5F4B32]/40 rounded-full"></span>
              Este campo no se puede modificar
            </p>
          </div>
        
          <div className="pt-5 border-t border-[#E6D7C3]/30 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-[#E6D7C3]/50 text-[#5F4B32] rounded-xl 
                hover:bg-[#F5E4D2]/20 transition-all duration-200 font-medium
                disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex-1 bg-gradient-to-r from-[#6F4E37] to-[#5D3D26] text-white px-4 py-3 rounded-xl 
                hover:from-[#5D3D26] hover:to-[#4A2F1A] transition-all duration-200 
                flex items-center justify-center gap-2 font-medium shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Guardar cambios
                </>
              )}
            </button>
          </div>

          {!hasChanges() && Object.keys(touched).length > 0 && (
            <div className="text-center">
              <p className="text-xs text-[#5F4B32]/60">
                No hay cambios para guardar
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;