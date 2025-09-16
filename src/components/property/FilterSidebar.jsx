import React from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Home, 
  Bed, 
  Bath, 
  Square, 
  MapPin, 
  Star,
  Calendar,
  X
} from 'lucide-react';

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters }) => {
  const propertyTypes = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'land', label: 'Land' },
    { value: 'office', label: 'Office' },
  ];

  const categories = [
    { value: 'luxury', label: 'Luxury', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'premium', label: 'Premium', color: 'bg-purple-100 text-purple-800' },
    { value: 'standard', label: 'Standard', color: 'bg-blue-100 text-blue-800' },
    { value: 'budget', label: 'Budget', color: 'bg-green-100 text-green-800' },
    { value: 'commercial', label: 'Commercial', color: 'bg-orange-100 text-orange-800' },
  ];

  const locations = [
    'Bengaluru', 'Mumbai', 'Gurugram', 'Delhi', 'Hyderabad',
    'Pune', 'Chennai', 'Kolkata', 'Noida', 'Ahmedabad'
  ];

  const features = [
    'Swimming Pool', 'Garden', 'Balcony', 'Parking', 'Gym',
    'Security', 'Elevator', 'Fireplace', 'Hardwood Floors', 'Modern Kitchen'
  ];

  const amenities = [
    'Near School', 'Near Hospital', 'Near Shopping', 'Public Transport',
    'Near Park', 'Near Airport', 'Near Metro', 'Near Highway'
  ];

  const bedroomOptions = [1, 2, 3, 4, 5, 6];
  const bathroomOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5];

  const handleArrayFilterChange = (filterKey, value) => {
    const currentValues = filters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [filterKey]: newValues
    });
  };

  const handleRangeFilterChange = (filterKey, field, value) => {
    onFiltersChange({
      ...filters,
      [filterKey]: {
        ...filters[filterKey],
        [field]: parseInt(value)
      }
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const FilterSection = ({ title, icon: Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="w-5 h-5 text-primary-500" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </motion.div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-500 hover:text-primary-600 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range" icon={DollarSign}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price: {formatPrice(filters.priceRange.min)}
            </label>
            <input
              type="range"
              min="0"
              max="100000000"
              step="50000"
              value={filters.priceRange.min}
              onChange={(e) => handleRangeFilterChange('priceRange', 'min', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price: {formatPrice(filters.priceRange.max)}
            </label>
            <input
              type="range"
              min="0"
              max="100000000"
              step="50000"
              value={filters.priceRange.max}
              onChange={(e) => handleRangeFilterChange('priceRange', 'max', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </FilterSection>

      {/* Property Type */}
      <FilterSection title="Property Type" icon={Home}>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <label key={type.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.propertyType.includes(type.value)}
                onChange={() => handleArrayFilterChange('propertyType', type.value)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Category" icon={Star}>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.category.includes(category.value)}
                onChange={() => handleArrayFilterChange('category', category.value)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className={`ml-2 text-xs px-2 py-1 rounded-full ${category.color}`}>
                {category.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection title="Bedrooms" icon={Bed}>
        <div className="grid grid-cols-3 gap-2">
          {bedroomOptions.map((beds) => (
            <button
              key={beds}
              onClick={() => handleArrayFilterChange('bedrooms', beds)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                filters.bedrooms.includes(beds)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {beds}+
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection title="Bathrooms" icon={Bath}>
        <div className="grid grid-cols-4 gap-2">
          {bathroomOptions.map((baths) => (
            <button
              key={baths}
              onClick={() => handleArrayFilterChange('bathrooms', baths)}
              className={`px-2 py-2 text-sm rounded-lg border transition-colors duration-200 ${
                filters.bathrooms.includes(baths)
                  ? 'bg-primary-500 text-white border-primary-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {baths}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Area Range */}
      <FilterSection title="Area (sq ft)" icon={Square}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Area: {filters.areaRange.min.toLocaleString()} sq ft
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.areaRange.min}
              onChange={(e) => handleRangeFilterChange('areaRange', 'min', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Area: {filters.areaRange.max.toLocaleString()} sq ft
            </label>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={filters.areaRange.max}
              onChange={(e) => handleRangeFilterChange('areaRange', 'max', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Location" icon={MapPin}>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {locations.map((location) => (
            <label key={location} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.location.includes(location)}
                onChange={() => handleArrayFilterChange('location', location)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{location}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Year Built */}
      <FilterSection title="Year Built" icon={Calendar}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From: {filters.yearBuilt.min}
            </label>
            <input
              type="range"
              min="1900"
              max="2024"
              step="1"
              value={filters.yearBuilt.min}
              onChange={(e) => handleRangeFilterChange('yearBuilt', 'min', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To: {filters.yearBuilt.max}
            </label>
            <input
              type="range"
              min="1900"
              max="2024"
              step="1"
              value={filters.yearBuilt.max}
              onChange={(e) => handleRangeFilterChange('yearBuilt', 'max', e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features" icon={Star}>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {features.map((feature) => (
            <label key={feature} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.features.includes(feature)}
                onChange={() => handleArrayFilterChange('features', feature)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{feature}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Amenities */}
      <FilterSection title="Amenities" icon={Star}>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {amenities.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => handleArrayFilterChange('amenities', amenity)}
                className="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;
