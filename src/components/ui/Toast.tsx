import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number; // Durata in millisecondi
}

/**
 * Componente Toast per mostrare notifiche temporanee
 * 
 * @param type - Tipo di toast (success, error, info)
 * @param message - Messaggio da mostrare
 * @param onClose - Callback per chiudere il toast
 * @param duration - Durata in millisecondi (default: 5000ms)
 */
export const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Aspetta che l'animazione di uscita finisca
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Stili in base al tipo
  const styles = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-500',
      text: 'text-green-700 dark:text-green-400',
      icon: <CheckCircle size={20} className="text-green-500" />
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-500',
      text: 'text-red-700 dark:text-red-400',
      icon: <AlertCircle size={20} className="text-red-500" />
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-500',
      text: 'text-blue-700 dark:text-blue-400',
      icon: <AlertCircle size={20} className="text-blue-500" />
    }
  };

  const currentStyle = styles[type];

  return (
    <div 
      className={`
        fixed bottom-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg
        border-l-4 ${currentStyle.border} ${currentStyle.bg} ${currentStyle.text}
        transform transition-transform duration-300
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
      `}
      role="alert"
    >
      <div className="flex items-center">
        <div className="mr-3">
          {currentStyle.icon}
        </div>
        <div className="mr-8">
          {message}
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-auto text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
