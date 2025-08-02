import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAgentProperties, deleteProperty } from '../../../api/propertyAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaDollarSign, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useState } from 'react';

const MyProperties = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, propertyId: null });
  
  // Fetch agent's properties
  const { 
    data: properties = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['agentProperties', currentUser?.email],
    queryFn: () => getAgentProperties(currentUser?.email),
    enabled: !!currentUser?.email
  });
  
  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['agentProperties', currentUser?.email]);
      showSuccess('Property deleted successfully');
    },
    onError: (error) => {
      console.error('Delete property error:', error);
      showError('Failed to delete property');
    }
  });
  
  const handleDeleteProperty = (id) => {
    setConfirmDialog({ isOpen: true, propertyId: id });
  };

  const confirmDelete = () => {
    if (confirmDialog.propertyId) {
      deletePropertyMutation.mutate(confirmDialog.propertyId);
    }
  };
  
  const getVerificationBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
            <FaCheck className="mr-1" /> Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
            <FaTimes className="mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
            <FaSpinner className="mr-1" /> Pending
          </span>
        );
    }
  };
  
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
        <p>Error loading properties. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white">My Properties</h1>
        <Link to="/dashboard/add-property" className="btn btn-primary">
          Add New Property
        </Link>
      </div>
      
      {properties.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">No properties yet</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You haven't added any properties yet.
          </p>
          <Link to="/dashboard/add-property" className="btn btn-primary">
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={property.image} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getVerificationBadge(property.verificationStatus)}
                </div>
                {property.isAdvertised && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Advertised
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 dark:text-white">{property.title}</h2>
                
                <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{property.location}</span>
                </div>
                
                <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                  <FaDollarSign className="mr-2" />
                  <span>${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}</span>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {property.description}
                </p>
                
                <div className="flex justify-between">
                  <Link 
                    to={`/dashboard/edit-property/${property._id}`}
                    className="btn btn-sm btn-outline"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProperty(property._id)}
                    className="btn btn-sm btn-error btn-outline"
                    disabled={deletePropertyMutation.isLoading}
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDelete}
        title="Delete Property"
        message="Are you sure you want to delete this property? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletePropertyMutation.isLoading}
      />
    </div>
  );
};

export default MyProperties; 