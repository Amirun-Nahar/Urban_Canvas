import { useState } from 'react';
import { FaExclamationTriangle, FaQuestionCircle, FaInfoCircle } from 'react-icons/fa';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?', 
  type = 'warning',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle className="w-6 h-6 text-yellow-500" />;
      case 'question':
        return <FaQuestionCircle className="w-6 h-6 text-blue-500" />;
      case 'info':
        return <FaInfoCircle className="w-6 h-6 text-blue-500" />;
      default:
        return <FaExclamationTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getButtonStyles = () => {
    switch (type) {
      case 'warning':
        return {
          confirm: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
          cancel: 'bg-gray-300 hover:bg-gray-400 focus:ring-gray-500'
        };
      case 'question':
        return {
          confirm: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
          cancel: 'bg-gray-300 hover:bg-gray-400 focus:ring-gray-500'
        };
      case 'info':
        return {
          confirm: 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500',
          cancel: 'bg-gray-300 hover:bg-gray-400 focus:ring-gray-500'
        };
      default:
        return {
          confirm: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500',
          cancel: 'bg-gray-300 hover:bg-gray-400 focus:ring-gray-500'
        };
    }
  };

  const buttonStyles = getButtonStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 sm:mx-0 sm:h-10 sm:w-10">
                {getIcon()}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${buttonStyles.confirm}`}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                confirmText
              )}
            </button>
            <button
              type="button"
              className={`mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${buttonStyles.cancel}`}
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 