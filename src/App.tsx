import { BrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { AuthRoutes } from './router/public/PublicRoutes'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
      </QueryClientProvider>
    </RecoilRoot>
  )
}
 
export default App