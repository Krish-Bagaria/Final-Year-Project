import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Home, 
  BarChart3, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12%', icon: Users, color: 'text-blue-500' },
    { label: 'Properties Listed', value: '1,234', change: '+8%', icon: Home, color: 'text-green-500' },
    { label: 'Pending Verifications', value: '23', change: '-5%', icon: Shield, color: 'text-orange-500' },
    { label: 'Revenue (Monthly)', value: '$45,678', change: '+15%', icon: BarChart3, color: 'text-purple-500' },
  ];

  const recentUsers = [
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'buyer', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', role: 'seller', status: 'active', joinDate: '2024-01-14' },
    { id: 3, name: 'Mike Chen', email: 'mike@example.com', role: 'agent', status: 'pending', joinDate: '2024-01-13' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'buyer', status: 'active', joinDate: '2024-01-12' },
  ];

  const recentProperties = [
    { id: 1, title: 'Luxury Penthouse', price: 2500000, status: 'pending', owner: 'John Smith', date: '2024-01-15' },
    { id: 2, title: 'Family Home', price: 750000, status: 'approved', owner: 'Sarah Johnson', date: '2024-01-14' },
    { id: 3, title: 'Commercial Space', price: 1200000, status: 'rejected', owner: 'Mike Chen', date: '2024-01-13' },
    { id: 4, title: 'Apartment Unit', price: 450000, status: 'pending', owner: 'Emily Davis', date: '2024-01-12' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'properties', label: 'Properties', icon: Home },
    { id: 'verifications', label: 'Verifications', icon: Shield },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      approved: 'bg-green-100 text-green-800',
    };
    return colors[status] || colors.pending;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your real estate platform</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {stat.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Users</h3>
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Properties</h3>
                <div className="space-y-4">
                  {recentProperties.map((property) => (
                    <div key={property.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{property.title}</div>
                        <div className="text-sm text-gray-600">${property.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                        <button className="p-1 hover:bg-gray-200 rounded">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">All Users</h3>
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Roles</option>
                  <option>Buyers</option>
                  <option>Sellers</option>
                  <option>Agents</option>
                </select>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Join Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(user.joinDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'properties' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">All Properties</h3>
              <div className="flex items-center space-x-4">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Property</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Owner</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProperties.map((property) => (
                    <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{property.title}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">${property.price.toLocaleString()}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {property.owner}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(property.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Edit className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-200 rounded">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'verifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Pending Verifications</h3>
            <div className="space-y-4">
              {recentProperties
                .filter(p => p.status === 'pending')
                .map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{property.title}</h4>
                        <p className="text-gray-600">${property.price.toLocaleString()}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Pending Review
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                        Approve
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                        Reject
                      </button>
                      <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
