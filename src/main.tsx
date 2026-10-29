import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import { PopupProvider } from './components/CustomPopup/PopupContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PopupProvider>
      <AuthProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_AUTH}>
          <Provider store={store}>
            <Elements stripe={stripePromise}>
              <App />
            </Elements>
          </Provider>
        </GoogleOAuthProvider>
      </AuthProvider>
    </PopupProvider>
  </StrictMode>,
)
