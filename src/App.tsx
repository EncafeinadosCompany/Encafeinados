import './App.css'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthRoutes from './router';
import { AppDataProvider } from './common/context/AppDataContext';
const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AppDataProvider>
          <AuthRoutes />
        </AppDataProvider>
      </QueryClientProvider>
    </RecoilRoot>
  )
}
 
export default App