import React, { useState } from 'react';
import { Check, Pencil, X } from'@/common/ui/icons';

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
  type?: 'text' | 'email' | 'tel';
  disabled?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  onSave, 
  type = 'text',
  disabled = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    if (inputValue.trim() !== '') {
      onSave(inputValue);
    } else {
      setInputValue(value); // Revert to original if empty
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-[#5F4B32] mb-1">{label}</label>
      {isEditing ? (
        <div className="flex items-center">
          <input
            type={type}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 p-2 border border-[#E6D7C3] rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-[#DB8935]"
            autoFocus
          />
          <button 
            onClick={handleSave}
            className="ml-2 p-1.5 rounded-full bg-[#DB8935]/10 text-[#DB8935] hover:bg-[#DB8935]/20"
            aria-label="Guardar"
          >
            <Check className="h-4 w-4" />
          </button>
          <button 
            onClick={handleCancel}
            className="ml-1 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
            aria-label="Cancelar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-2 bg-white/80 rounded-lg border border-[#E6D7C3]/50">
          <span className="text-[#5F4B32]">{value || 'No especificado'}</span>
          {!disabled && (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-full bg-[#DB8935]/10 text-[#DB8935] hover:bg-[#DB8935]/20"
              aria-label="Editar"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditableField;