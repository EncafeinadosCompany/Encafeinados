import React from 'react'
import App from './App'
import './index.css'
import i18n from './common/utils/i18n/i18n'
import { Toaster } from 'react-hot-toast'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 60 * 24, 
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage, 
  key: 'REACT_QUERY_OFFLINE_CACHE', 
  throttleTime: 1000, 
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: Infinity
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <Toaster />
      <App />
    </I18nextProvider>
  </QueryClientProvider>
  // </React.StrictMode>
)