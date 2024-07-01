import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SocketProvider } from './context/SocketProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </UserProvider>
  </React.StrictMode>,
)
