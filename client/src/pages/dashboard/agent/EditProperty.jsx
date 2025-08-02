import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPropertyById, updateProperty } from '../../../api/propertyAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaImage, FaInfoCircle } from 'react-icons/fa';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image: '',
    priceRangeMin: '',
    priceRangeMax: '',
    description: ''
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
  
  // Update form data when property is loaded
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title,
        location: property.location,
        image: property.image,
        priceRangeMin: property.priceRange.min,
        priceRangeMax: property.priceRange.max,
        description: property.description
      });
    }
  }, [property]);
  
  // Update property mutation
  const updatePropertyMutation = useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      queryClient.invalidateQueries(['property', id]);
      queryClient.invalidateQueries(['agentProperties', currentUser?.email]);
      showSuccess('Property updated successfully');
      navigate('/dashboard/my-properties');
    },
    onError: (error) => {
      console.error('Update property error:', error);
      showError('Failed to update property');
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }
    
    if (!formData.priceRangeMin || formData.priceRangeMin <= 0) {
      newErrors.priceRangeMin = 'Minimum price must be greater than 0';
    }
    
    if (!formData.priceRangeMax || formData.priceRangeMax <= 0) {
      newErrors.priceRangeMax = 'Maximum price must be greater than 0';
    } else if (Number(formData.priceRangeMax) <= Number(formData.priceRangeMin)) {
      newErrors.priceRangeMax = 'Maximum price must be greater than minimum price';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      updatePropertyMutation.mutate({
        id,
        property: {
          title: formData.title,
          location: formData.location,
          image: formData.image,
          priceRange: {
            min: Number(formData.priceRangeMin),
            max: Number(formData.priceRangeMax)
          },
          description: formData.description
        }
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
  
  // Check if the current user is the property agent
  if (property && property.agentEmail !== currentUser?.email) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>You don't have permission to edit this property.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Edit Property</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Property Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaHome className="text-gray-400" />
              </div>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter property title"
              />
            </div>
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>
          
          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaMapMarkerAlt className="text-gray-400" />
              </div>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter property location"
              />
            </div>
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>
          
          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Image URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaImage className="text-gray-400" />
              </div>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.image ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter image URL"
              />
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
            
            {/* Image Preview */}
            {formData.image && !errors.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Property Preview" 
                  className="h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    setErrors({...errors, image: 'Invalid image URL'});
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="priceRangeMin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Minimum Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="priceRangeMin"
                  name="priceRangeMin"
                  value={formData.priceRangeMin}
                  onChange={handleChange}
                  min="1"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.priceRangeMin ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Minimum price"
                />
              </div>
              {errors.priceRangeMin && <p className="mt-1 text-sm text-red-600">{errors.priceRangeMin}</p>}
            </div>
            
            <div>
              <label htmlFor="priceRangeMax" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Maximum Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="priceRangeMax"
                  name="priceRangeMax"
                  value={formData.priceRangeMax}
                  onChange={handleChange}
                  min="1"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.priceRangeMax ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Maximum price"
                />
              </div>
              {errors.priceRangeMax && <p className="mt-1 text-sm text-red-600">{errors.priceRangeMax}</p>}
            </div>
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FaInfoCircle className="text-gray-400" />
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                placeholder="Enter property description"
              ></textarea>
            </div>
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/my-properties')}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updatePropertyMutation.isLoading}
            >
              {updatePropertyMutation.isLoading ? 'Updating...' : 'Update Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty; 