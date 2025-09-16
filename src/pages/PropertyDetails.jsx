import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Heart,
  Share2,
  MessageCircle,
  Phone,
  Mail,
  Verified,
  TrendingUp,
  Home,
  Car,
  Wifi,
  Shield,
  Star,
  DollarSign
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const PropertyDetails = () => {
  const { id } = useParams();
  const { properties } = useDashboard();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600">The property you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryColor = (category) => {
    const colors = {
      luxury: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      premium: 'bg-gradient-to-r from-purple-400 to-purple-600',
      standard: 'bg-gradient-to-r from-blue-400 to-blue-600',
      budget: 'bg-gradient-to-r from-green-400 to-green-600',
      commercial: 'bg-gradient-to-r from-orange-400 to-orange-600',
    };
    return colors[category] || colors.standard;
  };

  const getStatusColor = (status) => {
    const colors = {
      'for-sale': 'bg-green-100 text-green-800',
      'for-rent': 'bg-blue-100 text-blue-800',
      'sold': 'bg-gray-100 text-gray-800',
      'rented': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || colors['for-sale'];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 lg:h-[500px] overflow-hidden">
        <img
          src={property.images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Navigation */}
        <div className="absolute top-4 left-4 flex space-x-2">
          {property.isVerified && (
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1">
              <Verified className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-gray-900">Verified</span>
            </div>
          )}
          
          <div className={`${getCategoryColor(property.category)} text-white text-xs font-semibold px-3 py-1 rounded-lg`}>
            {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
          </div>
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          <div className={`${getStatusColor(property.status)} text-xs font-semibold px-3 py-1 rounded-lg`}>
            {property.status.replace('-', ' ').toUpperCase()}
          </div>
          
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          </button>
          
          <button className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200">
            <Share2 className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2">
          <div className="text-3xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </div>
          {property.aiPricePrediction && (
            <div className="text-sm text-gray-500">
              AI Prediction: {formatPrice(property.aiPricePrediction)}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">
                  {property.location.address}, {property.location.city}, {property.location.state} {property.location.zipCode}
                </span>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {property.description}
              </p>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                <div className="text-center">
                  <Bed className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.area.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Sq Ft</div>
                </div>
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-primary-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.yearBuilt}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ROI Analysis */}
            {property.roi && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Investment Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-800">Total ROI</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      +{property.roi.totalROI.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Cap Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {property.roi.capRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-purple-800">Monthly Rent</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPrice(property.roi.monthlyRent)}
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="font-medium text-orange-800">Appreciation</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {property.roi.appreciationRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Owner */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Owner</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {property.owner.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{property.owner.name}</div>
                    <div className="text-sm text-gray-600">Property Owner</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </button>
                  
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Location</h3>
              <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">
                    {property.location.lat}, {property.location.lng}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Virtual Tour */}
            {property.virtualTour && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Virtual Tour</h3>
                <div className="h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Home className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">360° Virtual Tour</p>
                    <button className="mt-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg text-sm">
                      Start Tour
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
