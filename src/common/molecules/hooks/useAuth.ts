import { ROLES } from '@/common/utils/lists/roles';

export const useAuth = () => {

  const pagesPermissions = (rol: string, navigate: (path: string) => void) => {

    if (rol === ROLES.COFFEE_LOVER) {
      return navigate("/coffeelover");
      
    } else if (rol === ROLES.STORE) {
      return navigate("/store/dashboard");

    } else {
      navigate("/");
    }
  }
  return {
    pagesPermissions
  };
};