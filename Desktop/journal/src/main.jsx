import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { TradeProvider } from './contexts/TradeContext.jsx'

// Unregister any existing service workers to prevent sw.js errors
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
            registration.unregister()
        })
    })
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <TradeProvider>
            <App />
        </TradeProvider>
    </React.StrictMode>,
)
