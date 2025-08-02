import axiosInstance from './axios';

// Get all verified properties
export const getProperties = async (params) => {
  const response = await axiosInstance.get('/properties', { params });
  return response.data;
};

// Get advertised properties
export const getAdvertisedProperties = async () => {
  const response = await axiosInstance.get('/properties/advertised');
  return response.data;
};

// Get a single property by ID
export const getPropertyById = async (id) => {
  const response = await axiosInstance.get(`/properties/${id}`);
  return response.data;
};

// Add a new property (agent only)
export const addProperty = async (propertyData) => {
  const response = await axiosInstance.post('/properties', propertyData);
  return response.data;
};

// Get properties by agent email (agent only)
export const getAgentProperties = async (email) => {
  const response = await axiosInstance.get(`/properties/agent/${email}`);
  return response.data;
};

// Update a property (agent only)
export const updateProperty = async (id, propertyData) => {
  const response = await axiosInstance.put(`/properties/${id}`, propertyData);
  return response.data;
};

// Delete a property (agent only)
export const deleteProperty = async (id) => {
  const response = await axiosInstance.delete(`/properties/${id}`);
  return response.data;
}; 