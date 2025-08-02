import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPropertyById } from '../../../api/propertyAPI';
import { advertiseProperty } from '../../../api/adminAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { FaMapMarkerAlt, FaDollarSign, FaUser, FaCheck, FaAd } from 'react-icons/fa';
import ConfirmDialog from '../../../components/ConfirmDialog';
import { useState } from 'react';

const AdvertiseProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false });
  
  // Fetch property details
  const { 
    data: property,
    isLoading: propertyLoading,
    error: propertyError
  } = useQuery({
    queryKey: ['property', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id
  });
  
  // Advertise property mutation
  const advertisePropertyMutation = useMutation({
    mutationFn: advertiseProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProperties']);
      queryClient.invalidateQueries(['property', id]);
      showSuccess('Property advertised successfully');
      navigate('/dashboard/manage-properties');
    },
    onError: (error) => {
      console.error('Advertise property error:', error);
      showError('Failed to advertise property');
    }
  });
  
  const handleAdvertiseProperty = () => {
    setConfirmDialog({ isOpen: true });
  };

  const confirmAdvertise = () => {
    advertisePropertyMutation.mutate(id);
  };
  
  if (propertyLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  
  if (propertyError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>Error loading property details. Please try again later.</p>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>Property not found.</p>
      </div>
    );
  }
  
  // Check if property is verified
  if (property.verificationStatus !== 'verified') {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>Only verified properties can be advertised. Please verify the property first.</p>
        <button 
          onClick={() => navigate('/dashboard/manage-properties')} 
          className="mt-4 btn btn-primary"
        >
          Back to Properties
        </button>
      </div>
    );
  }
  
  // Check if property is already advertised
  if (property.isAdvertised) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        <p>This property is already being advertised on the homepage.</p>
        <button 
          onClick={() => navigate('/dashboard/manage-properties')} 
          className="mt-4 btn btn-primary"
        >
          Back to Properties
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Advertise Property</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-64">
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2 dark:text-white">{property.title}</h2>
              
              <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                <FaMapMarkerAlt className="mr-2" />
                <span>{property.location}</span>
              </div>
              
              <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                <FaDollarSign className="mr-2" />
                <span>${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img 
                    src={property.agentImage || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'} 
                    alt={property.agentName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white flex items-center">
                    <FaUser className="mr-1 text-xs" /> {property.agentName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{property.agentEmail}</p>
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded-md mb-4 flex items-center">
                <FaCheck className="text-green-600 dark:text-green-400 mr-2" />
                <p className="text-green-800 dark:text-green-200">
                  This property has been verified and is eligible for advertisement.
                </p>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {property.description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Advertise Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-white">Advertise on Homepage</h2>
            
            <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-md mb-6">
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
                <FaAd className="inline-block mr-2" />
                Advertisement Benefits
              </h3>
              <ul className="text-blue-700 dark:text-blue-300 space-y-2">
                <li>• Featured on the homepage</li>
                <li>• Higher visibility to potential buyers</li>
                <li>• Increased chance of quick sale</li>
                <li>• Premium placement in search results</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleAdvertiseProperty}
                className="btn btn-primary w-full"
                disabled={advertisePropertyMutation.isLoading}
              >
                {advertisePropertyMutation.isLoading ? 'Processing...' : 'Advertise This Property'}
              </button>
              
              <button
                onClick={() => navigate('/dashboard/manage-properties')}
                className="btn btn-outline w-full"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false })}
        onConfirm={confirmAdvertise}
        title="Advertise Property?"
        message="Are you sure you want to advertise this property on the homepage?"
        type="question"
        confirmText="Yes, advertise it"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdvertiseProperty; 