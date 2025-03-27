import { ROLES } from '@/common/utils/lists/roles';
import { useRecoilState, useRecoilValue } from 'recoil';

export const useAuth = () => {

  const pagesPermissions = (rol: string,  navigate: (path: string) => void) => {

    if (rol === ROLES.COFFEE_LOVER) {
      console.log("coffeelover");
      return navigate("/coffeelover");
    } else if (rol === ROLES.STORE) {
      return navigate("/store");
    } else {
      navigate("/"); 
    }
  }

  return {
    // user: auth.user,
    // isAuthenticated: auth.isAuthenticated,
    // token: auth.token,
    // login,
    // logout,
    // updateUser,
    pagesPermissions
  };
};