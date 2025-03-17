import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../../modules/user/pages/HomePage';
import LoginPage from '../../modules/auth/pages/LoginPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;