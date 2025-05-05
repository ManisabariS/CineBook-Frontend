import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile } from '../services/api';
import { FaUser, FaEnvelope, FaHeart, FaSpinner, FaExclamationTriangle, FaSave } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    preferences: '',
    avatar: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || !userData._id) {
          throw new Error('User not authenticated');
        }

        const data = await fetchUserProfile(userData._id);
        setUser(data);
        setFormData({ 
          name: data.name, 
          email: data.email, 
          preferences: data.preferences || '',
          avatar: data.avatar || null
        });
        setError(null);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load user profile. Please try again.');
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const userData = JSON.parse(localStorage.getItem('user'));
      const updatedUser = await updateUserProfile(userData._id, formData);
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify({
        ...userData,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar
      }));
      
      setIsEditing(false);
      toast.success('Profile updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen"
      >
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-lg">Loading your profile...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-red-500 p-4"
      >
        <FaExclamationTriangle className="text-4xl mb-4" />
        <p className="text-lg font-medium mb-2">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 lg:p-6"
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <img
                  src={formData.avatar || 'https://i.imgur.com/placeholder-avatar.jpg'}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </label>
                )}
              </div>
              <h2 className="text-xl font-bold text-center">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({ 
                    name: user.name, 
                    email: user.email, 
                    preferences: user.preferences || '',
                    avatar: user.avatar || null
                  });
                }}
                className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors mb-2"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Profile Form */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6">Profile Information</h2>
            
            <form onSubmit={handleFormSubmit}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaUser className="text-blue-500" /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaEnvelope className="text-blue-500" /> Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FaHeart className="text-blue-500" /> Preferences
                  </label>
                  <textarea
                    name="preferences"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      !isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
                    }`}
                    rows="4"
                    value={formData.preferences}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tell us about your movie preferences..."
                  />
                </div>

                {isEditing && (
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isUpdating}
                    className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 ${
                      isUpdating ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isUpdating ? (
                      <span className="flex items-center">
                        <FaSpinner className="animate-spin mr-2" /> Saving...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaSave className="mr-2" /> Save Changes
                      </span>
                    )}
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Profile;