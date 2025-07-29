import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../utils/toast';
import api from '../../utils/axios';

const ManageProperties = () => {
  const queryClient = useQueryClient();

  // Fetch properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['allProperties'],
    queryFn: async () => {
      const response = await api.get('/properties/all');
      return response.data;
    }
  });

  // Verify property mutation
  const verifyProperty = useMutation({
    mutationFn: async (propertyId) => {
      const response = await api.patch(`/properties/${propertyId}/verify`, {
        status: 'verified'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allProperties']);
      showToast.success('Property verified successfully');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to verify property');
    }
  });

  // Reject property mutation
  const rejectProperty = useMutation({
    mutationFn: async (propertyId) => {
      const response = await api.patch(`/properties/${propertyId}/verify`, {
        status: 'rejected'
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['allProperties']);
      showToast.success('Property rejected');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to reject property');
    }
  });

  const handleVerify = (propertyId) => {
    if (window.confirm('Are you sure you want to verify this property?')) {
      verifyProperty.mutate(propertyId);
    }
  };

  const handleReject = (propertyId) => {
    if (window.confirm('Are you sure you want to reject this property?')) {
      rejectProperty.mutate(propertyId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-lg">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Manage Properties</h1>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Agent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Price Range
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
              {properties.map((property) => (
                <tr key={property._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-500">{property.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={property.agent.image}
                        alt={property.agent.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{property.agent.name}</div>
                        <div className="text-sm text-gray-500">{property.agent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      ${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      property.verificationStatus === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : property.verificationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {property.verificationStatus}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {property.verificationStatus === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerify(property._id)}
                          className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800 hover:bg-green-200"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleReject(property._id)}
                          className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-800 hover:bg-red-200"
                        >
                          Reject
                        </button>
                      </div>
                    )}
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

export default ManageProperties; 