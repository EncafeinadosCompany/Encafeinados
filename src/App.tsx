import './App.css'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthRoutes from './router';
const queryClient = new QueryClient();
import { ResponsiveProvider } from './common/contexts/ResponsiveContext';


function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
      <ResponsiveProvider>
        <AuthRoutes />
        </ResponsiveProvider>
      </QueryClientProvider>
    </RecoilRoot>
  )
}
 
export default App