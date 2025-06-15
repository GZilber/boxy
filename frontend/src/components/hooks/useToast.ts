import { success, error, info, warning } from '../ui/Toast';

export const useToast = () => {
  return {
    success,
    error,
    info,
    warning
  };
};
