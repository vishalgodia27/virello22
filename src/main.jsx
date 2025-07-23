import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Createtrip from './create-trip/index.jsx'
import Header from "./components/custom/Header.jsx";
import { ToastProvider } from './components/ui/toast';
import { GoogleOAuthProvider } from '@react-oauth/google'

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <App />
      </>
    )
  },
  {
    path: "/create-trip",
    element: (
      <ToastProvider>
        <Header />
        <Createtrip />
      </ToastProvider>
    )
  }
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>


    <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </React.StrictMode>
)