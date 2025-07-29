import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { showToast } from '../../utils/toast';
import api from '../../utils/axios';

const Properties = () => {
  const queryClient = useQueryClient();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    description: '',
    image: null,
    priceRange: {
      min: '',
      max: ''
    }
  });
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch agent properties
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['agentProperties'],
    queryFn: async () => {
      const response = await api.get('/properties/agent');
      return response.data;
    }
  });

  // Update property mutation
  const updateProperty = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('location', data.location);
      formDataToSend.append('description', data.description);
      formDataToSend.append('priceRangeMin', data.priceRange.min);
      formDataToSend.append('priceRangeMax', data.priceRange.max);
      if (data.image instanceof File) {
        formDataToSend.append('image', data.image);
      }

      const response = await api.put(`/properties/${selectedProperty._id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agentProperties']);
      setShowUpdateModal(false);
      showToast.success('Property updated successfully');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to update property');
    }
  });

  // Delete property mutation
  const deleteProperty = useMutation({
    mutationFn: async (propertyId) => {
      const response = await api.delete(`/properties/${propertyId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['agentProperties']);
      showToast.success('Property deleted successfully');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to delete property');
    }
  });

  const handleUpdate = (property) => {
    setSelectedProperty(property);
    setFormData({
      title: property.title,
      location: property.location,
      description: property.description,
      priceRange: {
        min: property.priceRange.min,
        max: property.priceRange.max
      }
    });
    setPreviewImage(property.image);
    setShowUpdateModal(true);
  };

  const handleDelete = (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteProperty.mutate(propertyId);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.length) {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else if (name.startsWith('price')) {
      setFormData(prev => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [name === 'priceMin' ? 'min' : 'max']: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.title || !formData.location || !formData.description) {
      showToast.error('Please fill in all required fields');
      return;
    }

    if (!formData.priceRange.min || !formData.priceRange.max) {
      showToast.error('Please specify the price range');
      return;
    }

    if (parseFloat(formData.priceRange.min) >= parseFloat(formData.priceRange.max)) {
      showToast.error('Minimum price must be less than maximum price');
      return;
    }

    updateProperty.mutate(formData);
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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
        <Link
          to="/agent/properties/add"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
        >
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow">
          <p className="text-gray-500">You haven't added any properties yet</p>
          <Link
            to="/agent/properties/add"
            className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Add Your First Property
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property._id}
              className="overflow-hidden rounded-lg bg-white shadow-md"
            >
              <div className="relative h-48">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-2 right-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    property.verificationStatus === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : property.verificationStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {property.verificationStatus}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {property.title}
                </h3>
                <p className="mb-4 text-gray-600">{property.location}</p>
                <div className="mb-4 text-sm text-gray-700">
                  <span className="font-semibold">Price Range: </span>
                  ${property.priceRange.min.toLocaleString()} - ${property.priceRange.max.toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  {property.verificationStatus !== 'rejected' && (
                    <button
                      onClick={() => handleUpdate(property)}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(property._id)}
                    className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Property Modal */}
      {showUpdateModal && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-3xl rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Update Property</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Property Image
                </label>
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt={formData.title}
                    className="mb-4 h-48 w-full rounded-lg object-cover"
                  />
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary/90"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Property Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  required
                />
              </div>

              {/* Price Range */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700">
                    Minimum Price
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="priceMin"
                      name="priceMin"
                      value={formData.priceRange.min}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700">
                    Maximum Price
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="priceMax"
                      name="priceMax"
                      value={formData.priceRange.max}
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUpdateModal(false);
                    setSelectedProperty(null);
                  }}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProperty.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  {updateProperty.isPending ? 'Updating...' : 'Update Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties; 