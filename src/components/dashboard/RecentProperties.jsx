import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, TrendingUp, Eye } from 'lucide-react';

const RecentProperties = ({ properties }) => {
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

  return (
    <div className="space-y-4">
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
        >
          <div className="flex items-start space-x-3">
            {/* Property Image */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {property.title}
                </h4>
                <div className={`${getCategoryColor(property.category)} text-white text-xs font-semibold px-2 py-1 rounded-full ml-2`}>
                  {property.category.charAt(0).toUpperCase() + property.category.slice(1)}
                </div>
              </div>

              <div className="flex items-center text-gray-600 text-xs mb-2">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate">
                  {property.location.city}, {property.location.state}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Bed className="w-3 h-3 mr-1" />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-3 h-3 mr-1" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center">
                    <Square className="w-3 h-3 mr-1" />
                    <span>{property.area.toLocaleString()}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    {formatPrice(property.price)}
                  </div>
                  {property.roi && (
                    <div className="flex items-center text-xs text-green-600">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>+{property.roi.totalROI.toFixed(1)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {properties.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No recent properties</p>
        </div>
      )}
    </div>
  );
};

export default RecentProperties;
