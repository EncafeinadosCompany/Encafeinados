import { RouterProvider } from 'react-router-dom'
import './App.css'

import routes from './router/public/PublicRoutes'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </RecoilRoot>
  )
}
 
export default App