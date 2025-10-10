const Property = require("../models/Property");
const User = require("../models/User");

/**
 * Create new property
 * @param {String} sellerId - Seller user ID
 * @param {Object} propertyData - Property data
 * @returns {Promise<Object>} Created property
 */
const createProperty = async (sellerId, propertyData) => {
  try {
    const {
      title,
      description,
      type,
      price,
      area,
      bedrooms,
      bathrooms,
      location,
      address,
      city,
      state,
      pincode,
      amenities,
      images,
      documents,
      features,
      nearbyPlaces,
    } = propertyData;

    // Verify seller exists and has seller role
    const seller = await User.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    if (seller.role !== "seller" && seller.role !== "both") {
      throw new Error("User must be a seller to create properties");
    }

    // Create property
    const property = await Property.create({
      seller: sellerId,
      title,
      description,
      type,
      price,
      area,
      bedrooms,
      bathrooms,
      location,
      address,
      city,
      state,
      pincode,
      amenities,
      images,
      documents,
      features,
      nearbyPlaces,
      status: "active",
      isActive: true,
    });

    return property;
  } catch (error) {
    throw new Error(`Failed to create property: ${error.message}`);
  }
};

/**
 * Get property by ID
 * @param {String} propertyId - Property ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Property object
 */
const getPropertyById = async (propertyId, options = {}) => {
  try {
    const { populateSeller = true, incrementView = false } = options;

    let query = Property.findById(propertyId);

    if (populateSeller) {
      query = query.populate("seller", "name email phone avatar city state");
    }

    const property = await query.lean();

    if (!property) {
      throw new Error("Property not found");
    }

    // Increment view count if requested
    if (incrementView && property.isActive) {
      await Property.findByIdAndUpdate(propertyId, {
        $inc: { viewCount: 1 },
      });
    }

    return property;
  } catch (error) {
    throw new Error(`Failed to fetch property: ${error.message}`);
  }
};

/**
 * Get all properties with filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Properties with pagination
 */
const getAllProperties = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      city,
      location,
      status,
      isFeatured,
      isVerified,
      search,
      sortBy = "-createdAt",
    } = filters;

    const skip = (page - 1) * limit;
    const query = { isActive: true };

    // Apply filters
    if (type) query.type = type;
    if (status) query.status = status;
    if (isFeatured !== undefined) query.isFeatured = isFeatured;
    if (isVerified !== undefined) query.isVerified = isVerified;
    if (city) query.city = new RegExp(city, "i");
    if (location) query.location = new RegExp(location, "i");
    if (bedrooms) query.bedrooms = parseInt(bedrooms);

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Search filter (title, description, location)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    const properties = await Property.find(query)
      .populate("seller", "name email phone avatar")
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Property.countDocuments(query);

    return {
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch properties: ${error.message}`);
  }
};

/**
 * Get featured properties
 * @param {Number} limit - Number of properties to fetch
 * @returns {Promise<Array>} Featured properties
 */
const getFeaturedProperties = async (limit = 6) => {
  try {
    const properties = await Property.find({
      isActive: true,
      isFeatured: true,
      status: "active",
    })
      .populate("seller", "name email phone avatar")
      .sort("-createdAt")
      .limit(limit)
      .lean();

    return properties;
  } catch (error) {
    throw new Error(`Failed to fetch featured properties: ${error.message}`);
  }
};

/**
 * Get trending properties (most viewed)
 * @param {Number} limit - Number of properties
 * @param {Number} days - Days to look back (default 7)
 * @returns {Promise<Array>} Trending properties
 */
const getTrendingProperties = async (limit = 6, days = 7) => {
  try {
    const properties = await Property.find({
      isActive: true,
      status: "active",
      createdAt: { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
    })
      .populate("seller", "name email phone avatar")
      .sort("-viewCount -uniqueViews")
      .limit(limit)
      .lean();

    return properties;
  } catch (error) {
    throw new Error(`Failed to fetch trending properties: ${error.message}`);
  }
};

/**
 * Get seller's properties
 * @param {String} sellerId - Seller ID
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Seller's properties
 */
const getSellerProperties = async (sellerId, filters = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      sortBy = "-createdAt",
    } = filters;

    const skip = (page - 1) * limit;
    const query = { seller: sellerId, isActive: true };

    if (status) query.status = status;
    if (type) query.type = type;

    const properties = await Property.find(query)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Property.countDocuments(query);

    return {
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch seller properties: ${error.message}`);
  }
};

/**
 * Update property
 * @param {String} propertyId - Property ID
 * @param {String} sellerId - Seller ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated property
 */
const updateProperty = async (propertyId, sellerId, updateData) => {
  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      throw new Error("Property not found");
    }

    // Verify ownership
    if (property.seller.toString() !== sellerId.toString()) {
      throw new Error("You can only update your own properties");
    }

    // Update allowed fields
    const allowedUpdates = [
      "title",
      "description",
      "price",
      "area",
      "bedrooms",
      "bathrooms",
      "location",
      "address",
      "city",
      "state",
      "pincode",
      "amenities",
      "images",
      "documents",
      "features",
      "nearbyPlaces",
      "status",
    ];

    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        property[field] = updateData[field];
      }
    });

    await property.save();

    return property;
  } catch (error) {
    throw new Error(`Failed to update property: ${error.message}`);
  }
};

/**
 * Delete property (soft delete)
 * @param {String} propertyId - Property ID
 * @param {String} sellerId - Seller ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteProperty = async (propertyId, sellerId) => {
  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      throw new Error("Property not found");
    }

    // Verify ownership
    if (property.seller.toString() !== sellerId.toString()) {
      throw new Error("You can only delete your own properties");
    }

    // Soft delete
    property.isActive = false;
    property.deletedAt = Date.now();
    await property.save();

    return {
      message: "Property deleted successfully",
      propertyId: property._id,
    };
  } catch (error) {
    throw new Error(`Failed to delete property: ${error.message}`);
  }
};

/**
 * Update property status
 * @param {String} propertyId - Property ID
 * @param {String} sellerId - Seller ID
 * @param {String} status - New status
 * @returns {Promise<Object>} Updated property
 */
const updatePropertyStatus = async (propertyId, sellerId, status) => {
  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      throw new Error("Property not found");
    }

    // Verify ownership
    if (property.seller.toString() !== sellerId.toString()) {
      throw new Error("You can only update your own properties");
    }

    property.status = status;
    await property.save();

    return property;
  } catch (error) {
    throw new Error(`Failed to update property status: ${error.message}`);
  }
};

/**
 * Mark property as featured (Admin only)
 * @param {String} propertyId - Property ID
 * @returns {Promise<Object>} Updated property
 */
const markAsFeatured = async (propertyId) => {
  try {
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { isFeatured: true },
      { new: true }
    );

    if (!property) {
      throw new Error("Property not found");
    }

    return property;
  } catch (error) {
    throw new Error(`Failed to mark as featured: ${error.message}`);
  }
};

/**
 * Remove from featured (Admin only)
 * @param {String} propertyId - Property ID
 * @returns {Promise<Object>} Updated property
 */
const removeFromFeatured = async (propertyId) => {
  try {
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { isFeatured: false },
      { new: true }
    );

    if (!property) {
      throw new Error("Property not found");
    }

    return property;
  } catch (error) {
    throw new Error(`Failed to remove from featured: ${error.message}`);
  }
};

/**
 * Verify property (Admin only)
 * @param {String} propertyId - Property ID
 * @returns {Promise<Object>} Updated property
 */
const verifyProperty = async (propertyId) => {
  try {
    const property = await Property.findByIdAndUpdate(
      propertyId,
      { isVerified: true },
      { new: true }
    );

    if (!property) {
      throw new Error("Property not found");
    }

    return property;
  } catch (error) {
    throw new Error(`Failed to verify property: ${error.message}`);
  }
};

/**
 * Get property statistics
 * @param {String} sellerId - Seller ID
 * @returns {Promise<Object>} Property statistics
 */
const getPropertyStatistics = async (sellerId) => {
  try {
    const stats = await Property.aggregate([
      {
        $match: {
          seller: sellerId,
          isActive: true,
        },
      },
      {
        $facet: {
          statusCount: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          typeCount: [
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
              },
            },
          ],
          totalStats: [
            {
              $group: {
                _id: null,
                totalProperties: { $sum: 1 },
                totalViews: { $sum: "$viewCount" },
                uniqueViews: { $sum: "$uniqueViews" },
                featuredCount: {
                  $sum: { $cond: ["$isFeatured", 1, 0] },
                },
                verifiedCount: {
                  $sum: { $cond: ["$isVerified", 1, 0] },
                },
              },
            },
          ],
          priceStats: [
            {
              $group: {
                _id: null,
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
              },
            },
          ],
        },
      },
    ]);

    return stats[0];
  } catch (error) {
    throw new Error(`Failed to fetch property statistics: ${error.message}`);
  }
};

/**
 * Search properties with advanced filters
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Object>} Search results
 */
const searchProperties = async (searchParams) => {
  try {
    const {
      query,
      type,
      minPrice,
      maxPrice,
      minBedrooms,
      maxBedrooms,
      city,
      location,
      amenities,
      page = 1,
      limit = 12,
      sortBy = "relevance",
    } = searchParams;

    const skip = (page - 1) * limit;
    const filter = { isActive: true, status: "active" };

    // Text search
    if (query) {
      filter.$text = { $search: query };
    }

    // Filters
    if (type) filter.type = type;
    if (city) filter.city = new RegExp(city, "i");
    if (location) filter.location = new RegExp(location, "i");

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Bedroom range
    if (minBedrooms || maxBedrooms) {
      filter.bedrooms = {};
      if (minBedrooms) filter.bedrooms.$gte = parseInt(minBedrooms);
      if (maxBedrooms) filter.bedrooms.$lte = parseInt(maxBedrooms);
    }

    // Amenities filter
    if (amenities && amenities.length > 0) {
      filter.amenities = { $all: amenities };
    }

    // Sort options
    let sort = {};
    switch (sortBy) {
      case "price_asc":
        sort = { price: 1 };
        break;
      case "price_desc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "popular":
        sort = { viewCount: -1 };
        break;
      case "relevance":
      default:
        if (query) {
          sort = { score: { $meta: "textScore" } };
        } else {
          sort = { createdAt: -1 };
        }
    }

    const properties = await Property.find(filter)
      .populate("seller", "name email phone avatar")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Property.countDocuments(filter);

    return {
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
};

/**
 * Get similar properties
 * @param {String} propertyId - Property ID
 * @param {Number} limit - Number of similar properties
 * @returns {Promise<Array>} Similar properties
 */
const getSimilarProperties = async (propertyId, limit = 4) => {
  try {
    const property = await Property.findById(propertyId);

    if (!property) {
      throw new Error("Property not found");
    }

    const similarProperties = await Property.find({
      _id: { $ne: propertyId },
      isActive: true,
      status: "active",
      type: property.type,
      city: property.city,
      price: {
        $gte: property.price * 0.7,
        $lte: property.price * 1.3,
      },
    })
      .populate("seller", "name email phone avatar")
      .limit(limit)
      .lean();

    return similarProperties;
  } catch (error) {
    throw new Error(`Failed to fetch similar properties: ${error.message}`);
  }
};

module.exports = {
  createProperty,
  getPropertyById,
  getAllProperties,
  getFeaturedProperties,
  getTrendingProperties,
  getSellerProperties,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  markAsFeatured,
  removeFromFeatured,
  verifyProperty,
  getPropertyStatistics,
  searchProperties,
  getSimilarProperties,
};
