import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';

const Profile = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    bio: currentUser?.bio || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just show a success message
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      showError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      bio: currentUser?.bio || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold dark:text-white">Profile</h1>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary flex items-center"
            >
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="btn btn-primary flex items-center"
              >
                <FaSave className="mr-2" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="btn btn-secondary flex items-center"
              >
                <FaTimes className="mr-2" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 dark:border-gray-700">
                  <img
                    src={currentUser?.image || 'https://i.ibb.co/MBtjqXQ/no-avatar.gif'}
                    alt={currentUser?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                    <FaCamera size={16} />
                  </button>
                )}
              </div>
              <div className="mt-4">
                <h2 className="text-xl font-semibold dark:text-white">{currentUser?.name}</h2>
                <p className="text-gray-600 dark:text-gray-400">{currentUser?.role}</p>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white text-lg">{currentUser?.name || 'Not provided'}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Enter your email"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white text-lg">{currentUser?.email || 'Not provided'}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaPhone className="inline mr-2" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input w-full"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white text-lg">{currentUser?.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="form-input w-full"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white text-lg">{currentUser?.address || 'Not provided'}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="form-input w-full"
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white text-lg">{currentUser?.bio || 'No bio provided'}</p>
                )}
              </div>

              {/* Account Information */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold dark:text-white mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Account Type
                    </label>
                    <p className="text-gray-900 dark:text-white">{currentUser?.role?.charAt(0).toUpperCase() + currentUser?.role?.slice(1)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900 dark:text-white">
                      {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
