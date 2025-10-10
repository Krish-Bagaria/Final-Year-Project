const propertyService = require("../services/propertyService");

/**
 * @route   POST /api/properties
 * @desc    Create new property
 * @access  Private (Seller only)
 */
const createProperty = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const propertyData = req.body;

    const property = await propertyService.createProperty(
      sellerId,
      propertyData
    );

    return res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: {
        property,
      },
    });
  } catch (error) {
    console.error("Create property error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create property",
    });
  }
};

/**
 * @route   GET /api/properties
 * @desc    Get all properties with filters
 * @access  Public
 */
const getAllProperties = async (req, res) => {
  try {
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      type: req.query.type,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      bedrooms: req.query.bedrooms,
      city: req.query.city,
      location: req.query.location,
      status: req.query.status,
      isFeatured: req.query.isFeatured,
      isVerified: req.query.isVerified,
      search: req.query.search,
      sortBy: req.query.sortBy,
    };

    const result = await propertyService.getAllProperties(filters);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get all properties error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch properties",
    });
  }
};

/**
 * @route   GET /api/properties/featured
 * @desc    Get featured properties
 * @access  Public
 */
const getFeaturedProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const properties = await propertyService.getFeaturedProperties(limit);

    return res.status(200).json({
      success: true,
      data: {
        properties,
        count: properties.length,
      },
    });
  } catch (error) {
    console.error("Get featured properties error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch featured properties",
    });
  }
};

/**
 * @route   GET /api/properties/trending
 * @desc    Get trending properties (most viewed)
 * @access  Public
 */
const getTrendingProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const days = parseInt(req.query.days) || 7;

    const properties = await propertyService.getTrendingProperties(limit, days);

    return res.status(200).json({
      success: true,
      data: {
        properties,
        count: properties.length,
      },
    });
  } catch (error) {
    console.error("Get trending properties error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch trending properties",
    });
  }
};

/**
 * @route   GET /api/properties/my-listings
 * @desc    Get current seller's properties
 * @access  Private (Seller only)
 */
const getMyListings = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      status: req.query.status,
      type: req.query.type,
      sortBy: req.query.sortBy,
    };

    const result = await propertyService.getSellerProperties(sellerId, filters);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get my listings error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your listings",
    });
  }
};

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public
 */
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await propertyService.getPropertyById(id, {
      populateSeller: true,
      incrementView: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        property,
      },
    });
  } catch (error) {
    console.error("Get property by ID error:", error);
    return res.status(404).json({
      success: false,
      message: error.message || "Property not found",
    });
  }
};

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property
 * @access  Private (Seller only - own property)
 */
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;
    const updateData = req.body;

    const property = await propertyService.updateProperty(
      id,
      sellerId,
      updateData
    );

    return res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data: {
        property,
      },
    });
  } catch (error) {
    console.error("Update property error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update property",
    });
  }
};

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property (soft delete)
 * @access  Private (Seller only - own property)
 */
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;

    const result = await propertyService.deleteProperty(id, sellerId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        propertyId: result.propertyId,
      },
    });
  } catch (error) {
    console.error("Delete property error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete property",
    });
  }
};

/**
 * @route   PATCH /api/properties/:id/status
 * @desc    Update property status
 * @access  Private (Seller only - own property)
 */
const updatePropertyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const property = await propertyService.updatePropertyStatus(
      id,
      sellerId,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Property status updated successfully",
      data: {
        property,
      },
    });
  } catch (error) {
    console.error("Update property status error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update property status",
    });
  }
};

/**
 * @route   PATCH /api/properties/:id/featured
 * @desc    Mark property as featured
 * @access  Private (Admin only)
 */
const markAsFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await propertyService.markAsFeatured(id);

    return res.status(200).json({
      success: true,
      message: "Property marked as featured",
      data: {
        property,
      },
    });
  } catch (error) {
    console.error("Mark as featured error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to mark as featured",
    });
  }
};

/**
 * @route   PATCH /api/properties/:id/unfeatured
 * @desc    Remove property from featured
 * @access  Private (Admin only)
 */
const removeFromFeatured = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await propertyService.removeFromFeatured(id);

    return res.status(200).json({
      success: true,
      message: "Property removed from featured",
      data: {
        property,
      },
    });
  } catch (error) {
    console.error("Remove from featured error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to remove from featured",
    });
  }
};

/**
 * @route   PATCH /api/properties/:id/verify
 * @desc    Verify property
 * @access  Private (Admin only)
 */
const verifyProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await propertyService.verifyProperty(id);

    return res.status(200).json({
      success: true,
      message: "Property verified successfully",
      data: {
        property,
      },
    });
  } catch (error) {
    console.error("Verify property error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to verify property",
    });
  }
};

/**
 * @route   GET /api/properties/search
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
      minBedrooms: req.query.minBedrooms,
      maxBedrooms: req.query.maxBedrooms,
      city: req.query.city,
      location: req.query.location,
      amenities: req.query.amenities
        ? req.query.amenities.split(",")
        : undefined,
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
    };

    const result = await propertyService.searchProperties(searchParams);

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
 * @route   GET /api/properties/:id/similar
 * @desc    Get similar properties
 * @access  Public
 */
const getSimilarProperties = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 4;

    const properties = await propertyService.getSimilarProperties(id, limit);

    return res.status(200).json({
      success: true,
      data: {
        properties,
        count: properties.length,
      },
    });
  } catch (error) {
    console.error("Get similar properties error:", error);
    return res.status(404).json({
      success: false,
      message: error.message || "Failed to fetch similar properties",
    });
  }
};

/**
 * @route   GET /api/properties/stats/seller
 * @desc    Get seller's property statistics
 * @access  Private (Seller only)
 */
const getSellerStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const stats = await propertyService.getPropertyStatistics(sellerId);

    return res.status(200).json({
      success: true,
      data: {
        stats,
      },
    });
  } catch (error) {
    console.error("Get seller stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch statistics",
    });
  }
};

/**
 * @route   GET /api/properties/seller/:sellerId
 * @desc    Get properties by seller ID (public)
 * @access  Public
 */
const getPropertiesBySeller = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const filters = {
      page: req.query.page,
      limit: req.query.limit,
      status: "active", // Only show active properties publicly
      type: req.query.type,
      sortBy: req.query.sortBy,
    };

    const result = await propertyService.getSellerProperties(sellerId, filters);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get properties by seller error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch seller properties",
    });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getFeaturedProperties,
  getTrendingProperties,
  getMyListings,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  markAsFeatured,
  removeFromFeatured,
  verifyProperty,
  searchProperties,
  getSimilarProperties,
  getSellerStats,
  getPropertiesBySeller,
};
