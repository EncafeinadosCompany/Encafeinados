import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getEncryptedItem, saveEncryptedItem } from '../utils/security/storage_encrypted.utils';

interface BranchContextType {
  selectedBranchId: string | null;
  isActive: boolean;
  setIsActive: (active: boolean) => void
  setSelectedBranchId: (branchId: string) => void;
  toggleSelectVisibility: () => void
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

interface BranchProviderProps {
  children: ReactNode;
}

export const BranchProvider = ({ children }: BranchProviderProps) => {

  const [selectedBranchId, setSelectedBranchIdState] = useState<string | null>(() => {
    return getEncryptedItem('branchId') || null;
  });
  const [isActive, setIsActive] = useState(true)

  const setSelectedBranchId = (branchId: string) => {
    setSelectedBranchIdState(branchId);
    saveEncryptedItem('branchId', branchId);
  };

    const toggleSelectVisibility = () => {
    localStorage.removeItem("IsActive");
    localStorage.removeItem('branchId');
    setSelectedBranchIdState(null);
    setIsActive(false)
  };

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'branchId') {
        setSelectedBranchIdState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: BranchContextType = {
    isActive,
    setIsActive,
    selectedBranchId,
    setSelectedBranchId,
    toggleSelectVisibility
  };

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
};

// ✅ Hook personalizado
export const useBranchContext = (): BranchContextType => {
  const context = useContext(BranchContext);
  if (context === undefined) {
    throw new Error('useBranch debe ser usado dentro de un BranchProvider');
  }
  return context;
};