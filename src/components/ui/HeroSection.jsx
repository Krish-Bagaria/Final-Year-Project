import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Home as HomeIcon, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const propertyTypes = [
    'All Types',
    'Apartment',
    'House',
    'Villa',
    'Commercial',
    'Land',
    'Office'
  ];

  const locations = [
    'All Locations',
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia'
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                Find Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
                  Dream Property
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Discover premium properties with AI-powered insights, 
                investment analytics, and verified listings. Your perfect 
                home or investment opportunity awaits.
              </motion.p>
            </div>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
            >
              <div className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by address, neighborhood, or ZIP code"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                  />
                </div>

                {/* Filters Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Location Filter */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                    >
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Property Type Filter */}
                  <div className="relative">
                    <HomeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <Link
                  to="/properties"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Properties</span>
                </Link>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">10K+</div>
                <div className="text-sm text-gray-600">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">5K+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">Cities</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop"
                  alt="Luxury Property"
                  className="w-full h-96 lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Property Badge */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">Verified</span>
                  </div>
                </div>

                {/* Price Badge */}
                <div className="absolute bottom-6 left-6 bg-primary-500 text-white rounded-lg px-4 py-2">
                  <div className="text-2xl font-bold">$2.5M</div>
                  <div className="text-sm opacity-90">Luxury Penthouse</div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">ROI</div>
                    <div className="text-lg font-bold text-green-600">+12.5%</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Location</div>
                    <div className="text-sm text-gray-600">Manhattan, NY</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
