import { CoffeeLoverProfileType } from "@/api/types/coffelovers/coffelovers.type";

export const setAuthStorage = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}


export const setAuthStorageGoogle = (token: string, user: any) => {
    localStorage.setItem('token', token);

    const data = {
        email: user.email,
        role: user.role.name,
    };
    localStorage.setItem('user', JSON.stringify(data));
}

export const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('storeOrBranchId');
    localStorage.removeItem('userId')
    localStorage.removeItem('coffeeProfile')
    localStorage.removeItem('profile')
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isVerified');
}

export const getAuthStorage = () => {
    return {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        storeOrBranch:localStorage.getItem('storeOrBranchId') 
    };
};

export const useLocalStorage = (key: string): number | null => {
  const item = localStorage.getItem(key);
  return item ? Number(item) : null;
};


export const saveCoffeeLoverProfileToStorage = (profileData: CoffeeLoverProfileType) => {
    // Save the entire profile if needed
    localStorage.setItem('coffeeProfile', JSON.stringify(profileData));
    
    // Save specific fields individually for easier access
    localStorage.setItem('coffeeProfileId', profileData.id.toString());
    localStorage.setItem('coffeeCoins', profileData.coffee_coins.toString());
    
    // Save person details
    if (profileData.person) {
      localStorage.setItem('userFullName', profileData.person.full_name);
      localStorage.setItem('userEmail', profileData.person.user_email);
     
    }
    
    localStorage.setItem('isVerified', profileData.is_verified ? 'true' : 'false');
  };


  export const getCoffeeLoverProfileFromStorage = (): Partial<CoffeeLoverProfileType> => {
    const storedProfile = localStorage.getItem('coffeeProfile');
    
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    
    // If full profile isn't available, construct from individual fields
    const id = Number(localStorage.getItem('coffeeProfileId') || '0');
    const coffee_coins = Number(localStorage.getItem('coffeeCoins') || '0');
    const is_verified = localStorage.getItem('isVerified') === 'true';
    
    return {
      id,
      person: {
        user_id: Number(localStorage.getItem('userId') || '0'),
        user_email: localStorage.getItem('userEmail') || '',
        full_name: localStorage.getItem('userFullName') || '',
        phone_number: localStorage.getItem('userPhone') || '',
      },
      coffee_coins,
      is_verified
    };
  };