import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, makeUserAdmin, makeUserAgent, deleteUser, markUserAsFraud } from '../../../api/adminAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { FaUserShield, FaUserTie, FaTrash, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import ConfirmDialog from '../../../components/ConfirmDialog';

const ManageUsers = () => {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null, userId: null });
  
  // Fetch all users
  const { 
    data: users = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers
  });
  
  // Make user admin mutation
  const makeAdminMutation = useMutation({
    mutationFn: makeUserAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSuccess('User is now an admin');
    },
    onError: (error) => {
      console.error('Make admin error:', error);
      showError('Failed to make user an admin');
    }
  });
  
  // Make user agent mutation
  const makeAgentMutation = useMutation({
    mutationFn: makeUserAgent,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSuccess('User is now an agent');
    },
    onError: (error) => {
      console.error('Make agent error:', error);
      showError('Failed to make user an agent');
    }
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSuccess('User deleted successfully');
    },
    onError: (error) => {
      console.error('Delete user error:', error);
      showError('Failed to delete user');
    }
  });
  
  // Mark user as fraud mutation
  const markFraudMutation = useMutation({
    mutationFn: markUserAsFraud,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showSuccess('User marked as fraud and their properties have been removed');
    },
    onError: (error) => {
      console.error('Mark fraud error:', error);
      showError('Failed to mark user as fraud');
    }
  });
  
  const handleMakeAdmin = (id) => {
    setConfirmDialog({ isOpen: true, action: 'makeAdmin', userId: id });
  };
  
  const handleMakeAgent = (id) => {
    setConfirmDialog({ isOpen: true, action: 'makeAgent', userId: id });
  };
  
  const handleDeleteUser = (id) => {
    setConfirmDialog({ isOpen: true, action: 'delete', userId: id });
  };
  
  const handleMarkFraud = (id) => {
    setConfirmDialog({ isOpen: true, action: 'markFraud', userId: id });
  };

  const confirmAction = () => {
    if (confirmDialog.userId) {
      switch (confirmDialog.action) {
        case 'makeAdmin':
          makeAdminMutation.mutate(confirmDialog.userId);
          break;
        case 'makeAgent':
          makeAgentMutation.mutate(confirmDialog.userId);
          break;
        case 'delete':
          deleteUserMutation.mutate(confirmDialog.userId);
          break;
        case 'markFraud':
          markFraudMutation.mutate(confirmDialog.userId);
          break;
      }
    }
  };

  const getDialogConfig = () => {
    switch (confirmDialog.action) {
      case 'makeAdmin':
        return {
          title: 'Make User an Admin?',
          message: 'This will give the user full administrative privileges',
          type: 'warning',
          confirmText: 'Yes, make admin',
          cancelText: 'Cancel'
        };
      case 'makeAgent':
        return {
          title: 'Make User an Agent?',
          message: 'This will allow the user to add and manage properties',
          type: 'warning',
          confirmText: 'Yes, make agent',
          cancelText: 'Cancel'
        };
      case 'delete':
        return {
          title: 'Delete User?',
          message: 'This action cannot be undone',
          type: 'warning',
          confirmText: 'Yes, delete',
          cancelText: 'Cancel'
        };
      case 'markFraud':
        return {
          title: 'Mark User as Fraud?',
          message: 'This will mark the user as fraudulent and remove all their properties',
          type: 'warning',
          confirmText: 'Yes, mark as fraud',
          cancelText: 'Cancel'
        };
      default:
        return {};
    }
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      user.role.toLowerCase().includes(searchTermLower)
    );
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>Error loading users. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Manage Users</h1>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search users by name, email, or role..."
          />
        </div>
      </div>
      
      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={user.image || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'} 
                          alt={user.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 
                        user.role === 'agent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isFraud ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Fraud
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleMakeAdmin(user._id)}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                          title="Make Admin"
                        >
                          <FaUserShield size={18} />
                        </button>
                      )}
                      
                      {user.role !== 'agent' && !user.isFraud && (
                        <button
                          onClick={() => handleMakeAgent(user._id)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Make Agent"
                        >
                          <FaUserTie size={18} />
                        </button>
                      )}
                      
                      {user.role === 'agent' && !user.isFraud && (
                        <button
                          onClick={() => handleMarkFraud(user._id)}
                          className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                          title="Mark as Fraud"
                        >
                          <FaExclamationTriangle size={18} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete User"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmAction}
        {...getDialogConfig()}
      />
    </div>
  );
};

export default ManageUsers; 