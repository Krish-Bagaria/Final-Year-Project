import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Star,
  Eye,
  MessageCircle,
  Share2,
  Verified
} from 'lucide-react';

const PropertyCard = ({ 
  property, 
  onViewDetails, 
  onContactOwner, 
  onSaveProperty, 
  isSaved = false 
}) => {
  const [isLiked, setIsLiked] = useState(isSaved);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    onSaveProperty(property.id);
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price.toLocaleString()}`;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer"
      onClick={() => onViewDetails(property)}
    >
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images[currentImageIndex] || property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
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

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <div className={`${getStatusColor(property.status)} text-xs font-semibold px-3 py-1 rounded-lg`}>
            {property.status.replace('-', ' ').toUpperCase()}
          </div>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLike}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200"
        >
          <Heart 
            className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
          />
        </button>

        {/* Image Navigation */}
        {property.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(property);
            }}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Details</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContactOwner(property);
            }}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contact</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-2xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </div>
          {property.aiPricePrediction && (
            <div className="text-sm text-gray-500">
              AI: {formatPrice(property.aiPricePrediction)}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {property.location.city}, {property.location.state}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              <span>{property.area.toLocaleString()} sq ft</span>
            </div>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{property.yearBuilt}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          {property.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="bg-primary-50 text-primary-700 text-xs font-medium px-2 py-1 rounded-full"
            >
              {feature}
            </span>
          ))}
          {property.features.length > 3 && (
            <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
              +{property.features.length - 3} more
            </span>
          )}
        </div>

        {/* ROI Indicator */}
        {property.roi && (
          <div className="flex items-center justify-between bg-green-50 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-800">ROI</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              +{property.roi.totalROI.toFixed(1)}%
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(property);
            }}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            View Details
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onContactOwner(property);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle share functionality
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
