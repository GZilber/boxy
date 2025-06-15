import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []); 

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 5000) => {
      const id = uuidv4();
      const newToast: Toast = { id, message, type, duration };

      setToasts((prevToasts) => [...prevToasts, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'info', duration);
    },
    [addToast]
  );

  const success = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'success', duration);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'error', duration);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'warning', duration);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, duration?: number) => {
      return addToast(message, 'info', duration);
    },
    [addToast]
  );

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      toasts.forEach((toast) => {
        if (toast.duration) {
          clearTimeout(toast.duration);
        }
      });
    };
  }, [toasts]);

  return {
    toasts,
    addToast,
    removeToast,
    toast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
