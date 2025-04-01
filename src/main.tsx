import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import './index.css'
import App from './App'
import i18n from './common/utils/i18n/i18n'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
      <I18nextProvider i18n={i18n}>
          <Toaster/>
          <App />
      </I18nextProvider>
  // </React.StrictMode>
)