import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getPropertyById } from '../../../api/propertyAPI';
import { makeOffer } from '../../../api/offerAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { useNotification } from '../../../contexts/NotificationContext';

const MakeOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    offeredAmount: '',
    buyingDate: ''
  });
  
  const [errors, setErrors] = useState({});
  
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
  
  // Set min/max amount based on property price range
  useEffect(() => {
    if (property) {
      setFormData(prev => ({
        ...prev,
        offeredAmount: property.priceRange.min
      }));
    }
  }, [property]);
  
  // Make offer mutation
  const makeOfferMutation = useMutation({
    mutationFn: makeOffer,
    onSuccess: () => {
      showSuccess('Offer submitted successfully');
      navigate('/dashboard/property-bought');
    },
    onError: (error) => {
      console.error('Make offer error:', error);
      showError('Failed to submit offer');
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.offeredAmount) {
      newErrors.offeredAmount = 'Offered amount is required';
    } else if (isNaN(formData.offeredAmount) || Number(formData.offeredAmount) <= 0) {
      newErrors.offeredAmount = 'Offered amount must be a positive number';
    } else if (property && (
      Number(formData.offeredAmount) < property.priceRange.min || 
      Number(formData.offeredAmount) > property.priceRange.max
    )) {
      newErrors.offeredAmount = `Offered amount must be between $${property.priceRange.min.toLocaleString()} and $${property.priceRange.max.toLocaleString()}`;
    }
    
    if (!formData.buyingDate) {
      newErrors.buyingDate = 'Buying date is required';
    } else {
      const selectedDate = new Date(formData.buyingDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.buyingDate = 'Buying date cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      makeOfferMutation.mutate({
        propertyId: id,
        offeredAmount: Number(formData.offeredAmount),
        buyingDate: formData.buyingDate
      });
    }
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
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Make an Offer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Property Details */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="h-48">
              <img 
                src={property.image} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
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
              
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img 
                    src={property.agentImage} 
                    alt={property.agentName} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium dark:text-white">{property.agentName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{property.agentEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Offer Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">Your Offer Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Offered Amount */}
              <div>
                <label htmlFor="offeredAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Offered Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="offeredAmount"
                    name="offeredAmount"
                    value={formData.offeredAmount}
                    onChange={handleChange}
                    min={property.priceRange.min}
                    max={property.priceRange.max}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.offeredAmount ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Enter amount"
                  />
                </div>
                {errors.offeredAmount && <p className="mt-1 text-sm text-red-600">{errors.offeredAmount}</p>}
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Acceptable range: ${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}
                </p>
              </div>
              
              {/* Buying Date */}
              <div>
                <label htmlFor="buyingDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Buying Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="buyingDate"
                    name="buyingDate"
                    value={formData.buyingDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.buyingDate ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  />
                </div>
                {errors.buyingDate && <p className="mt-1 text-sm text-red-600">{errors.buyingDate}</p>}
              </div>
              
              {/* Buyer Information */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Buyer Information</h3>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <img 
                      src={currentUser?.image || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'} 
                      alt={currentUser?.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{currentUser?.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={makeOfferMutation.isLoading}
                >
                  {makeOfferMutation.isLoading ? 'Submitting...' : 'Submit Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeOffer; 