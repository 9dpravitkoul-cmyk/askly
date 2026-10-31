import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, title, variant = 'info', duration = 4000 }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev, { id, message, title, variant, duration }]);
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (message, title) => addToast({ message, title, variant: 'success' }),
    error: (message, title) => addToast({ message, title, variant: 'error', duration: 6000 }),
    info: (message, title) => addToast({ message, title, variant: 'info' }),
    warning: (message, title) => addToast({ message, title, variant: 'warning' }),
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, dismissToast }}>
      {children}
      <aside
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-[999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4 sm:px-0"
      >
        {toasts.map((item) => (
          <div key={item.id} className="pointer-events-auto animate-in slide-in-from-bottom-3 duration-200">
            <Toast
              title={item.title}
              message={item.message}
              variant={item.variant}
              duration={item.duration}
              onDismiss={() => dismissToast(item.id)}
            />
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
