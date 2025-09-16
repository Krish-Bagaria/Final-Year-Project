import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Home, 
  SlidersHorizontal,
  Grid3X3,
  List,
  SortAsc,
  X
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import PropertyCard from '../components/property/PropertyCard';
import FilterSidebar from '../components/property/FilterSidebar';
import PropertyList from '../components/property/PropertyList';

const Properties = () => {
  const { properties, loading } = useDashboard();
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('price');
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 100000000 },
    propertyType: [],
    bedrooms: [],
    bathrooms: [],
    areaRange: { min: 0, max: 10000 },
    location: [],
    features: [],
    amenities: [],
    category: [],
    yearBuilt: { min: 1900, max: 2024 },
  });

  // Update filtered properties when properties or filters change
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.price >= filters.priceRange.min && property.price <= filters.priceRange.max
    );

    // Property type filter
    if (filters.propertyType.length > 0) {
      filtered = filtered.filter(property =>
        filters.propertyType.includes(property.type)
      );
    }

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter(property =>
        filters.bedrooms.includes(property.bedrooms)
      );
    }

    // Bathrooms filter
    if (filters.bathrooms.length > 0) {
      filtered = filtered.filter(property =>
        filters.bathrooms.includes(property.bathrooms)
      );
    }

    // Area range filter
    filtered = filtered.filter(property =>
      property.area >= filters.areaRange.min && property.area <= filters.areaRange.max
    );

    // Location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter(property =>
        filters.location.includes(property.location.city)
      );
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter(property =>
        filters.features.some(feature => property.features.includes(feature))
      );
    }

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.some(amenity => property.amenities.includes(amenity))
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(property =>
        filters.category.includes(property.category)
      );
    }

    // Year built filter
    filtered = filtered.filter(property =>
      property.yearBuilt >= filters.yearBuilt.min && property.yearBuilt <= filters.yearBuilt.max
    );

    // Sort properties
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'area':
          aValue = a.area;
          bValue = b.area;
          break;
        case 'date':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'roi':
          aValue = a.roi?.totalROI || 0;
          bValue = b.roi?.totalROI || 0;
          break;
        default:
          aValue = a.price;
          bValue = b.price;
      }

      if (sortOrder === 'asc') {
        return aValue - bValue;
      } else {
        return bValue - aValue;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filters, sortBy, sortOrder]);

  const handlePropertyClick = (property) => {
    // Navigate to property details
    console.log('View property:', property);
  };

  const handleContactOwner = (property) => {
    // Handle contact owner
    console.log('Contact owner:', property);
  };

  const handleSaveProperty = (propertyId) => {
    // Handle save property
    console.log('Save property:', propertyId);
  };

  const clearFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 100000000 },
      propertyType: [],
      bedrooms: [],
      bathrooms: [],
      areaRange: { min: 0, max: 10000 },
      location: [],
      features: [],
      amenities: [],
      category: [],
      yearBuilt: { min: 1900, max: 2024 },
    });
    setSearchQuery('');
  };

  const activeFiltersCount = Object.values(filters).reduce((count, filter) => {
    if (Array.isArray(filter)) {
      return count + filter.length;
    } else if (typeof filter === 'object' && filter.min !== undefined) {
      return count + (filter.min > 0 || filter.max < 10000000 ? 1 : 0);
    }
    return count;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
              <p className="text-gray-600 mt-1">
                {filteredProperties.length} properties found
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md lg:mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <SortAsc className="w-4 h-4 text-gray-400" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="area-desc">Area: Largest First</option>
                  <option value="area-asc">Area: Smallest First</option>
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="roi-desc">Best ROI First</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Properties Grid/List */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PropertyCard
                        property={property}
                        onViewDetails={handlePropertyClick}
                        onContactOwner={handleContactOwner}
                        onSaveProperty={handleSaveProperty}
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <PropertyList
                  properties={filteredProperties}
                  onPropertyClick={handlePropertyClick}
                  onContactOwner={handleContactOwner}
                  onSaveProperty={handleSaveProperty}
                />
              )
            ) : (
              <div className="text-center py-12">
                <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No properties found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden">
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <FilterSidebar
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
