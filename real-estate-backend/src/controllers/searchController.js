const searchService = require("../services/searchService");

/**
 * @route   GET /api/search
 * @desc    Search properties with advanced filters
 * @access  Public
 */
const searchProperties = async (req, res) => {
  try {
    const searchParams = {
      query: req.query.q,
      type: req.query.type,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      minArea: req.query.minArea,
      maxArea: req.query.maxArea,
      minBedrooms: req.query.minBedrooms,
      maxBedrooms: req.query.maxBedrooms,
      bathrooms: req.query.bathrooms,
      city: req.query.city,
      location: req.query.location,
      amenities: req.query.amenities
        ? req.query.amenities.split(",")
        : undefined,
      features: req.query.features ? JSON.parse(req.query.features) : undefined,
      isFeatured: req.query.isFeatured,
      isVerified: req.query.isVerified,
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
    };

    const result = await searchService.searchProperties(searchParams);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Search properties error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Search failed",
    });
  }
};

/**
 * @route   GET /api/search/suggestions
 * @desc    Get search suggestions/autocomplete
 * @access  Public
 */
const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    const limit = parseInt(req.query.limit) || 10;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Search query must be at least 2 characters",
      });
    }

    const suggestions = await searchService.getSearchSuggestions(q, limit);

    return res.status(200).json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Get suggestions error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get suggestions",
    });
  }
};

/**
 * @route   GET /api/search/popular
 * @desc    Get popular searches
 * @access  Public
 */
const getPopularSearches = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const popularSearches = await searchService.getPopularSearches(limit);

    return res.status(200).json({
      success: true,
      data: {
        popularSearches,
      },
    });
  } catch (error) {
    console.error("Get popular searches error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get popular searches",
    });
  }
};

/**
 * @route   GET /api/search/filters
 * @desc    Get available search filters
 * @access  Public
 */
const getSearchFilters = async (req, res) => {
  try {
    const filters = await searchService.getSearchFilters();

    return res.status(200).json({
      success: true,
      data: {
        filters,
      },
    });
  } catch (error) {
    console.error("Get search filters error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get search filters",
    });
  }
};

/**
 * @route   GET /api/search/price-ranges
 * @desc    Get price range categories with counts
 * @access  Public
 */
const getPriceRangeCategories = async (req, res) => {
  try {
    const categories = await searchService.getPriceRangeCategories();

    return res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  } catch (error) {
    console.error("Get price range categories error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get price range categories",
    });
  }
};

/**
 * @route   GET /api/search/locations
 * @desc    Get property count by location
 * @access  Public
 */
const getPropertyCountByLocation = async (req, res) => {
  try {
    const { city } = req.query;

    const locations = await searchService.getPropertyCountByLocation(city);

    return res.status(200).json({
      success: true,
      data: {
        locations,
      },
    });
  } catch (error) {
    console.error("Get property count by location error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get location data",
    });
  }
};

/**
 * @route   POST /api/search/save
 * @desc    Save user search
 * @access  Private
 */
const saveSearch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchParams, name } = req.body;

    if (!searchParams) {
      return res.status(400).json({
        success: false,
        message: "Search parameters are required",
      });
    }

    const savedSearch = await searchService.saveUserSearch(
      userId,
      searchParams,
      name
    );

    return res.status(201).json({
      success: true,
      message: "Search saved successfully",
      data: {
        savedSearch,
      },
    });
  } catch (error) {
    console.error("Save search error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to save search",
    });
  }
};

/**
 * @route   GET /api/search/saved
 * @desc    Get user's saved searches
 * @access  Private
 */
const getSavedSearches = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedSearches = await searchService.getSavedSearches(userId);

    return res.status(200).json({
      success: true,
      data: {
        savedSearches,
        count: savedSearches.length,
      },
    });
  } catch (error) {
    console.error("Get saved searches error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get saved searches",
    });
  }
};

/**
 * @route   DELETE /api/search/saved/:searchId
 * @desc    Delete saved search
 * @access  Private
 */
const deleteSavedSearch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { searchId } = req.params;

    const result = await searchService.deleteSavedSearch(searchId, userId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        searchId: result.searchId,
      },
    });
  } catch (error) {
    console.error("Delete saved search error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete saved search",
    });
  }
};

/**
 * @route   GET /api/search/nearby
 * @desc    Get nearby properties (geospatial search)
 * @access  Public
 */
const getNearbyProperties = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required",
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = radius ? parseFloat(radius) : 5;
    const limit = parseInt(req.query.limit) || 20;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude or longitude",
      });
    }

    const properties = await searchService.getNearbyProperties(
      latitude,
      longitude,
      radiusKm,
      limit
    );

    return res.status(200).json({
      success: true,
      data: {
        properties,
        count: properties.length,
        searchCenter: { lat: latitude, lng: longitude },
        radiusKm,
      },
    });
  } catch (error) {
    console.error("Get nearby properties error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get nearby properties",
    });
  }
};

module.exports = {
  searchProperties,
  getSearchSuggestions,
  getPopularSearches,
  getSearchFilters,
  getPriceRangeCategories,
  getPropertyCountByLocation,
  saveSearch,
  getSavedSearches,
  deleteSavedSearch,
  getNearbyProperties,
};
