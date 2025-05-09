import { ROLES } from '@/common/utils/lists/roles.utils';

export const useAuth = () => {

  const pagesPermissions = (rol: string, navigate: (path: string) => void) => {

    if (rol === ROLES.COFFEE_LOVER) {
      return navigate("/coffeelover");
      
    } else if (rol === ROLES.STORE) {
      return navigate("/stores");

    }else if (rol === ROLES.ADMIN) {
      return navigate("/admin");
    }
    else if (rol === ROLES.ADMIN_SUCURSAL) {
      return navigate("/sucursal");
    }
    else {
      navigate("/");
    }
  }
  return {
    pagesPermissions
  };
};