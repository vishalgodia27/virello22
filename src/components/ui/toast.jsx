import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ title, description, type = 'default', duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, title, description, type, duration };
    
    console.log('Adding toast:', newToast);
    setToasts(prev => {
      const newToasts = [...prev, newToast];
      console.log('Current toasts:', newToasts);
      return newToasts;
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback(({ title, description, type, duration }) => {
    console.log('Toast called with:', { title, description, type, duration });
    addToast({ title, description, type, duration });
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ id, title, description, type, onRemove }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-500 bg-green-50 text-green-900';
      case 'error':
        return 'border-red-500 bg-red-50 text-red-900';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 text-yellow-900';
      default:
        return 'border-gray-500 bg-white text-gray-900';
    }
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out pointer-events-auto',
        getTypeStyles()
      )}
    >
      <div className="flex-1">
        {title && <h4 className="font-semibold">{title}</h4>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={() => onRemove(id)}
        className="rounded p-1 hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}; 