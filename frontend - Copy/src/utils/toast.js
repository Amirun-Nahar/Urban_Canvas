import toast from 'react-hot-toast';

export const showToast = {
  success: (message) => {
    toast.success(message, {
      duration: 3000,
      style: {
        background: '#10B981',
        color: '#fff',
      },
    });
  },
  error: (message) => {
    toast.error(message, {
      duration: 3000,
      style: {
        background: '#EF4444',
        color: '#fff',
      },
    });
  },
  loading: (message) => {
    return toast.loading(message, {
      style: {
        background: '#3B82F6',
        color: '#fff',
      },
    });
  },
}; 