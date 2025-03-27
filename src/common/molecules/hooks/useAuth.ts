import { useRecoilState, useRecoilValue } from 'recoil';

export const useAuth = () => {

  const pagesPermissions = (rol: string,  navigate: (path: string) => void) => {

    if (rol === import.meta.env.VITE_ROLE_COFFEELOVER) {
      return navigate("/coffeelover");
    } else if (rol === import.meta.env.VITE_ROLE_STORE) {
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