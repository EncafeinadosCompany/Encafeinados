
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query' 
import { queryClient } from '@/api/queryClient' 
import { RecoilRoot } from 'recoil'
import { I18nextProvider } from 'react-i18next'
import './index.css'
import App from './App'
import i18n from './utils/i18n/i18n'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <QueryClientProvider client={queryClient}> 
    <RecoilRoot>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </I18nextProvider>
    </RecoilRoot>
    </QueryClientProvider>
  // </React.StrictMode>
)