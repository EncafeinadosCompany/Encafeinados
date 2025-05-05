import './App.css'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthRoutes from './router';
const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <AuthRoutes />
      </QueryClientProvider>
    </RecoilRoot>
  )
}
 
export default App