import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../utils/toast';
import api from '../../utils/axios';

const ManageUsers = () => {
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    }
  });

  // Make admin mutation
  const makeAdmin = useMutation({
    mutationFn: async (userId) => {
      const response = await api.patch(`/users/${userId}/role`, { role: 'admin' });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showToast.success('User role updated to admin');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to update user role');
    }
  });

  // Make agent mutation
  const makeAgent = useMutation({
    mutationFn: async (userId) => {
      const response = await api.patch(`/users/${userId}/role`, { role: 'agent' });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showToast.success('User role updated to agent');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to update user role');
    }
  });

  // Mark as fraud mutation
  const markAsFraud = useMutation({
    mutationFn: async (userId) => {
      const response = await api.patch(`/users/${userId}/fraud`, { isFraud: true });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showToast.success('User marked as fraud');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to mark user as fraud');
    }
  });

  // Delete user mutation
  const deleteUser = useMutation({
    mutationFn: async (userId) => {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      showToast.success('User deleted successfully');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to delete user');
    }
  });

  const handleMakeAdmin = (userId) => {
    if (window.confirm('Are you sure you want to make this user an admin?')) {
      makeAdmin.mutate(userId);
    }
  };

  const handleMakeAgent = (userId) => {
    if (window.confirm('Are you sure you want to make this user an agent?')) {
      makeAgent.mutate(userId);
    }
  };

  const handleMarkAsFraud = (userId) => {
    if (window.confirm('Are you sure you want to mark this user as fraud?')) {
      markAsFraud.mutate(userId);
    }
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser.mutate(userId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-lg">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Manage Users</h1>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={user.image || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'agent'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user.isFraud ? (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                        Fraud
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      {!user.isFraud && user.role !== 'admin' && (
                        <>
                          <button
                            onClick={() => handleMakeAdmin(user._id)}
                            className="rounded bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800 hover:bg-purple-200"
                          >
                            Make Admin
                          </button>
                          <button
                            onClick={() => handleMakeAgent(user._id)}
                            className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 hover:bg-blue-200"
                          >
                            Make Agent
                          </button>
                          {user.role === 'agent' && (
                            <button
                              onClick={() => handleMarkAsFraud(user._id)}
                              className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-200"
                            >
                              Mark as Fraud
                            </button>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers; 