import React from 'react'
import App from './App'
 import './index.css'
import i18n from './common/utils/i18n/i18n'
import { Toaster } from 'react-hot-toast'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <I18nextProvider i18n={i18n}>
      <Toaster  />
      <App />
    </I18nextProvider>
  </QueryClientProvider>
  // </React.StrictMode>
)