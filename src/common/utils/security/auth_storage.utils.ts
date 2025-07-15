import { CoffeeLoverProfileType } from "@/api/types/coffelovers/coffelovers.type";


export const setAuthStorageGoogle = (token: string) => {
  localStorage.setItem('token', token);

}

export const clearAuthStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userId')
  localStorage.removeItem('storeId')
  localStorage.removeItem('branchId')
  localStorage.removeItem('coffeeCoins')
  localStorage.removeItem('profile')
  localStorage.removeItem('userFullName');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('isVerified');
}

export const getAuthStorage = () => {
  return {
    token: localStorage.getItem('token'),

    storeOrBranch: localStorage.getItem('storeOrBranchId')
  };
};

export const useLocalStorage = (key: string): number | null => {
  const item = localStorage.getItem(key);
  return item ? Number(item) : null;
};


export const saveCoffeeLoverProfileToStorage = (profileData: CoffeeLoverProfileType) => {
  
  if (profileData.person) {
    localStorage.setItem('userFullName', profileData.person.full_name);
  }

  localStorage.setItem('isVerified', profileData.is_verified ? 'true' : 'false');
};

