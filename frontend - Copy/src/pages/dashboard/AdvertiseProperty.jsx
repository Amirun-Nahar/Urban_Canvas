import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { showToast } from '../../utils/toast';
import api from '../../utils/axios';

const AdvertiseProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const addProperty = useMutation({
    mutationFn: async (data) => {
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('location', data.location);
      formDataToSend.append('description', data.description);
      formDataToSend.append('priceRangeMin', data.priceRange.min);
      formDataToSend.append('priceRangeMax', data.priceRange.max);
      if (data.image) {
        formDataToSend.append('image', data.image);
      }

      const response = await api.post('/properties', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    },
    onSuccess: () => {
      showToast.success('Property added successfully');
      navigate('/agent/properties');
    },
    onError: (error) => {
      showToast.error(error.response?.data?.message || 'Failed to add property');
    }
  });

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

    if (!formData.image) {
      showToast.error('Please upload a property image');
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

    addProperty.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Add New Property</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property Image
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Property preview"
                    className="mx-auto mb-4 h-48 w-full rounded-lg object-cover"
                  />
                ) : (
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
                )}
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="image"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/90"
                  >
                    <span>Upload a file</span>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
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

          {/* Agent Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agent Name
              </label>
              <input
                type="text"
                value={user.name}
                disabled
                className="mt-1 block w-full cursor-not-allowed rounded-md border-0 bg-gray-50 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agent Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="mt-1 block w-full cursor-not-allowed rounded-md border-0 bg-gray-50 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={addProperty.isPending}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {addProperty.isPending ? 'Adding Property...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvertiseProperty; 