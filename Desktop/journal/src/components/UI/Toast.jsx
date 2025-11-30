import { useState, useEffect } from 'react'
import './Toast.css'

let toastInstance = null

const Toast = () => {
    const [toasts, setToasts] = useState([])

    useEffect(() => {
        toastInstance = {
            success: (message) => addToast(message, 'success'),
            error: (message) => addToast(message, 'error'),
            warning: (message) => addToast(message, 'warning'),
            info: (message) => addToast(message, 'info')
        }

        return () => {
            toastInstance = null
        }
    }, [])

    const addToast = (message, type) => {
        const id = Date.now()
        setToasts(prev => [...prev, { id, message, type }])

        setTimeout(() => {
            removeToast(id)
        }, 4000)
    }

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={`toast toast-${toast.type} animate-slide-in`}
                    onClick={() => removeToast(toast.id)}
                >
                    <span className="toast-icon">
                        {toast.type === 'success' && '✓'}
                        {toast.type === 'error' && '✕'}
                        {toast.type === 'warning' && '⚠'}
                        {toast.type === 'info' && 'ℹ'}
                    </span>
                    <span className="toast-message">{toast.message}</span>
                </div>
            ))}
        </div>
    )
}

export const toast = {
    success: (message) => toastInstance?.success(message),
    error: (message) => toastInstance?.error(message),
    warning: (message) => toastInstance?.warning(message),
    info: (message) => toastInstance?.info(message)
}

export default Toast
