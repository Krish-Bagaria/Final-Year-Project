import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Camera,
  Settings,
  Shield,
  Heart,
  Eye
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateUser({
      ...user,
      ...formData,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
    });
    setIsEditing(false);
  };

  const stats = [
    { label: 'Properties Viewed', value: '24', icon: Eye },
    { label: 'Properties Saved', value: '8', icon: Heart },
    { label: 'Properties Contacted', value: '5', icon: Mail },
    { label: 'Days Active', value: '45', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-4">
                  <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors duration-200">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* User Info */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.name}
                </h2>
                <p className="text-gray-600 mb-4">{user?.email}</p>
                
                {/* Role Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 mb-6">
                  <Shield className="w-4 h-4 mr-1" />
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </div>

                {/* Bio */}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {user?.bio || 'No bio available. Click edit to add one.'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 mt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Stats</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-primary-500 hover:text-primary-600 font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{user?.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{user?.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-gray-900">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{user?.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Member Since
                  </label>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              )}
            </motion.div>

            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Notification Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                      <span className="ml-3 text-sm text-gray-700">Email notifications for new properties</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                      <span className="ml-3 text-sm text-gray-700">SMS notifications for urgent updates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                      <span className="ml-3 text-sm text-gray-700">Marketing emails and promotions</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Privacy Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                      <span className="ml-3 text-sm text-gray-700">Show profile to other users</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
                      <span className="ml-3 text-sm text-gray-700">Allow direct messages from agents</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Account Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Account Actions</h3>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Account Settings</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Privacy & Security</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <X className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-600">Delete Account</span>
                  </div>
                  <span className="text-red-400">→</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
