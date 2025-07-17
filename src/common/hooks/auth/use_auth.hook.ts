import { ROLES } from '@/common/utils/lists/roles.utils';

export const useAuth = () => {

  const pagesPermissions = (roles: string[], navigate: (path: string) => void) => {

    console.log("Roles del usuario:", roles);
 
    if (roles.includes(ROLES.STORE)) {
      return navigate("/stores");
    } 
    else if (roles.includes(ROLES.ADMIN_SUCURSAL)) {
      return navigate("/sucursal");
    } 
    else if (roles.includes(ROLES.ADMIN)) {
      return navigate("/admin");
    } 
    else if (roles.includes(ROLES.COFFEE_LOVER)) {
      return navigate("/coffeelover");
    } else {
      navigate("/");
    }
  };

  return {
    pagesPermissions
  };
};
