import React from 'react';

interface StoreAvatarProps {
  logo?: string;
  name?: string;
  type?: 'pending' | 'approved' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
}

export const StoreAvatar = ({ logo, name, type = 'pending', size = 'sm' }: StoreAvatarProps) => {
  const bgStyles = {
    pending: "from-orange-50 to-amber-100",
    approved: "from-green-50 to-emerald-100",
    rejected: "from-red-50 to-rose-100"
  };
  
  const textStyles = {
    pending: "text-[#6F4E37]",
    approved: "text-green-700",
    rejected: "text-red-700"
  };
  
  const sizes = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };
  
  const fontSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl"
  };
  
  return (
    <div className={`${sizes[size]} rounded-md bg-gradient-to-br ${bgStyles[type]} flex items-center justify-center overflow-hidden shadow-sm flex-shrink-0`}>
      {logo ? (
        <img 
          src={logo} 
          alt={name || 'Store logo'} 
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={`${textStyles[type]} font-semibold ${fontSizes[size]}`}>
          {name?.substring(0, 2).toUpperCase() || 'ST'}
        </span>
      )}
    </div>
  );
};