import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getAllProperties, verifyProperty, rejectProperty } from '../../../api/adminAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { FaMapMarkerAlt, FaDollarSign, FaCheck, FaTimes, FaSpinner, FaSearch, FaUser } from 'react-icons/fa';
import ConfirmDialog from '../../../components/ConfirmDialog';

const ManageProperties = () => {
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, action: null, propertyId: null });
  
  // Fetch all properties
  const { 
    data: properties = [], 
    isLoading,
    error
  } = useQuery({
    queryKey: ['adminProperties'],
    queryFn: getAllProperties
  });
  
  // Verify property mutation
  const verifyPropertyMutation = useMutation({
    mutationFn: verifyProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProperties']);
      showSuccess('Property verified successfully');
    },
    onError: (error) => {
      console.error('Verify property error:', error);
      showError('Failed to verify property');
    }
  });
  
  // Reject property mutation
  const rejectPropertyMutation = useMutation({
    mutationFn: rejectProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['adminProperties']);
      showSuccess('Property rejected successfully');
    },
    onError: (error) => {
      console.error('Reject property error:', error);
      showError('Failed to reject property');
    }
  });
  
  const handleVerifyProperty = (id) => {
    setConfirmDialog({ isOpen: true, action: 'verify', propertyId: id });
  };
  
  const handleRejectProperty = (id) => {
    setConfirmDialog({ isOpen: true, action: 'reject', propertyId: id });
  };

  const confirmAction = () => {
    if (confirmDialog.propertyId) {
      if (confirmDialog.action === 'verify') {
        verifyPropertyMutation.mutate(confirmDialog.propertyId);
      } else if (confirmDialog.action === 'reject') {
        rejectPropertyMutation.mutate(confirmDialog.propertyId);
      }
    }
  };

  const getDialogConfig = () => {
    if (confirmDialog.action === 'verify') {
      return {
        title: 'Verify Property?',
        message: 'Are you sure you want to verify this property?',
        type: 'question',
        confirmText: 'Yes, verify it',
        cancelText: 'Cancel'
      };
    } else if (confirmDialog.action === 'reject') {
      return {
        title: 'Reject Property?',
        message: 'Are you sure you want to reject this property?',
        type: 'warning',
        confirmText: 'Yes, reject it',
        cancelText: 'Cancel'
      };
    }
    return {};
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
  
  // Filter properties based on search term and status
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.agentEmail.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      filterStatus === 'all' || 
      property.verificationStatus === filterStatus;
      
    return matchesSearch && matchesStatus;
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
        <p>Error loading properties. Please try again later.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Manage Properties</h1>
      
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, location, or agent"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Properties List */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">No properties found</h2>
          <p className="text-gray-600 dark:text-gray-300">
            No properties match your current filters.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredProperties.map((property) => (
            <div 
              key={property._id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Property Image */}
                <div className="h-48 md:h-full">
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Property Details */}
                <div className="p-6 md:col-span-2">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                    <div>
                      <div className="flex items-center mb-2">
                        <h2 className="text-xl font-semibold dark:text-white mr-3">{property.title}</h2>
                        {getVerificationBadge(property.verificationStatus)}
                      </div>
                      
                      <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                        <FaMapMarkerAlt className="mr-2" />
                        <span>{property.location}</span>
                      </div>
                      
                      <div className="flex items-center mb-4 text-gray-600 dark:text-gray-300">
                        <FaDollarSign className="mr-2" />
                        <span>${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {property.isAdvertised && (
                      <div className="mt-2 md:mt-0">
                        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Advertised
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                      {property.description}
                    </p>
                  </div>
                  
                  {/* Agent Info */}
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
                  
                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    {property.verificationStatus === 'pending' && (
                      <>
                        <button
                          onClick={() => handleRejectProperty(property._id)}
                          className="btn btn-sm btn-outline btn-error"
                          disabled={rejectPropertyMutation.isLoading}
                        >
                          <FaTimes className="mr-1" /> Reject
                        </button>
                        <button
                          onClick={() => handleVerifyProperty(property._id)}
                          className="btn btn-sm btn-primary"
                          disabled={verifyPropertyMutation.isLoading}
                        >
                          <FaCheck className="mr-1" /> Verify
                        </button>
                      </>
                    )}
                    
                    {property.verificationStatus === 'rejected' && (
                      <button
                        onClick={() => handleVerifyProperty(property._id)}
                        className="btn btn-sm btn-primary"
                        disabled={verifyPropertyMutation.isLoading}
                      >
                        <FaCheck className="mr-1" /> Verify
                      </button>
                    )}
                    
                    {property.verificationStatus === 'verified' && !property.isAdvertised && (
                      <Link 
                        to={`/dashboard/advertise-property/${property._id}`}
                        className="btn btn-sm btn-accent"
                      >
                        Advertise
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmAction}
        {...getDialogConfig()}
      />
    </div>
  );
};

export default ManageProperties; 