const Property = require("../models/Property");
const SavedSearch = require("../models/SavedSearch");

/**
 * Advanced property search with filters
 * @param {Object} searchParams - Search parameters
 * @returns {Promise<Object>} Search results with pagination
 */
const searchProperties = async (searchParams) => {
  try {
    const {
      query,
      type,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      minBedrooms,
      maxBedrooms,
      bathrooms,
      city,
      location,
      amenities,
      features,
      isFeatured,
      isVerified,
      page = 1,
      limit = 12,
      sortBy = "relevance",
    } = searchParams;

    const skip = (page - 1) * limit;
    const filter = { isActive: true, status: "active" };

    // Text search
    if (query && query.trim()) {
      filter.$text = { $search: query.trim() };
    }

    // Property type filter
    if (type) {
      filter.type = type;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    // Area range filter
    if (minArea || maxArea) {
      filter.area = {};
      if (minArea) filter.area.$gte = parseInt(minArea);
      if (maxArea) filter.area.$lte = parseInt(maxArea);
    }

    // Bedroom range filter
    if (minBedrooms || maxBedrooms) {
      filter.bedrooms = {};
      if (minBedrooms) filter.bedrooms.$gte = parseInt(minBedrooms);
      if (maxBedrooms) filter.bedrooms.$lte = parseInt(maxBedrooms);
    }

    // Bathroom filter
    if (bathrooms) {
      filter.bathrooms = { $gte: parseInt(bathrooms) };
    }

    // Location filters
    if (city) {
      filter.city = new RegExp(city, "i");
    }

    if (location) {
      filter.location = new RegExp(location, "i");
    }

    // Featured/Verified filters
    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    if (isVerified !== undefined) {
      filter.isVerified = isVerified === "true" || isVerified === true;
    }

    // Amenities filter (must have all specified amenities)
    if (amenities && amenities.length > 0) {
      const amenitiesArray = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");
      filter.amenities = { $all: amenitiesArray };
    }

    // Features filters
    if (features) {
      if (features.facing) {
        filter["features.facing"] = features.facing;
      }
      if (features.furnishing) {
        filter["features.furnishing"] = features.furnishing;
      }
      if (features.parking) {
        filter["features.parking"] = { $gte: parseInt(features.parking) };
      }
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
      case "area_asc":
        sort = { area: 1 };
        break;
      case "area_desc":
        sort = { area: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "popular":
        sort = { viewCount: -1, uniqueViews: -1 };
        break;
      case "relevance":
      default:
        if (query && query.trim()) {
          sort = { score: { $meta: "textScore" } };
        } else {
          sort = { createdAt: -1 };
        }
    }

    // Execute search query
    const properties = await Property.find(filter)
      .populate("seller", "name email phone avatar city state")
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
      filters: {
        query,
        type,
        priceRange: { min: minPrice, max: maxPrice },
        areaRange: { min: minArea, max: maxArea },
        bedrooms: { min: minBedrooms, max: maxBedrooms },
        city,
        location,
        amenities: amenities && amenities.length > 0 ? amenities : null,
      },
    };
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
};

/**
 * Get search suggestions/autocomplete
 * @param {String} query - Search query
 * @param {Number} limit - Number of suggestions
 * @returns {Promise<Object>} Search suggestions
 */
const getSearchSuggestions = async (query, limit = 10) => {
  try {
    if (!query || query.trim().length < 2) {
      return {
        locations: [],
        properties: [],
      };
    }

    const searchRegex = new RegExp(query.trim(), "i");

    // Get location suggestions (unique cities and locations)
    const locationSuggestions = await Property.aggregate([
      {
        $match: {
          isActive: true,
          status: "active",
          $or: [{ city: searchRegex }, { location: searchRegex }],
        },
      },
      {
        $group: {
          _id: null,
          cities: { $addToSet: "$city" },
          locations: { $addToSet: "$location" },
        },
      },
      {
        $project: {
          _id: 0,
          suggestions: {
            $concatArrays: ["$cities", "$locations"],
          },
        },
      },
    ]);

    // Get property title suggestions
    const propertySuggestions = await Property.find({
      isActive: true,
      status: "active",
      title: searchRegex,
    })
      .select("title type city location price")
      .limit(limit)
      .lean();

    return {
      locations: locationSuggestions[0]?.suggestions.slice(0, limit) || [],
      properties: propertySuggestions,
    };
  } catch (error) {
    throw new Error(`Failed to get suggestions: ${error.message}`);
  }
};

/**
 * Get popular searches
 * @param {Number} limit - Number of popular searches
 * @returns {Promise<Array>} Popular search terms
 */
const getPopularSearches = async (limit = 10) => {
  try {
    // Get most searched locations
    const popularLocations = await Property.aggregate([
      {
        $match: {
          isActive: true,
          status: "active",
        },
      },
      {
        $group: {
          _id: "$location",
          count: { $sum: "$viewCount" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 0,
          term: "$_id",
          type: { $literal: "location" },
          count: 1,
        },
      },
    ]);

    return popularLocations;
  } catch (error) {
    throw new Error(`Failed to get popular searches: ${error.message}`);
  }
};

/**
 * Get search filters data
 * @returns {Promise<Object>} Available filters
 */
const getSearchFilters = async () => {
  try {
    const filters = await Property.aggregate([
      {
        $match: {
          isActive: true,
          status: "active",
        },
      },
      {
        $facet: {
          types: [
            {
              $group: {
                _id: "$type",
                count: { $sum: 1 },
              },
            },
            {
              $sort: { count: -1 },
            },
          ],
          cities: [
            {
              $group: {
                _id: "$city",
                count: { $sum: 1 },
              },
            },
            {
              $sort: { count: -1 },
            },
            {
              $limit: 20,
            },
          ],
          locations: [
            {
              $group: {
                _id: "$location",
                count: { $sum: 1 },
              },
            },
            {
              $sort: { count: -1 },
            },
            {
              $limit: 50,
            },
          ],
          priceRange: [
            {
              $group: {
                _id: null,
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" },
                avgPrice: { $avg: "$price" },
              },
            },
          ],
          areaRange: [
            {
              $group: {
                _id: null,
                minArea: { $min: "$area" },
                maxArea: { $max: "$area" },
                avgArea: { $avg: "$area" },
              },
            },
          ],
          bedroomOptions: [
            {
              $group: {
                _id: "$bedrooms",
                count: { $sum: 1 },
              },
            },
            {
              $sort: { _id: 1 },
            },
          ],
          amenities: [
            {
              $unwind: "$amenities",
            },
            {
              $group: {
                _id: "$amenities",
                count: { $sum: 1 },
              },
            },
            {
              $sort: { count: -1 },
            },
            {
              $limit: 20,
            },
          ],
        },
      },
    ]);

    return {
      types: filters[0].types,
      cities: filters[0].cities,
      locations: filters[0].locations,
      priceRange: filters[0].priceRange[0] || {},
      areaRange: filters[0].areaRange[0] || {},
      bedroomOptions: filters[0].bedroomOptions,
      amenities: filters[0].amenities,
    };
  } catch (error) {
    throw new Error(`Failed to get search filters: ${error.message}`);
  }
};

/**
 * Save user search
 * @param {String} userId - User ID
 * @param {Object} searchParams - Search parameters
 * @param {String} name - Search name (optional)
 * @returns {Promise<Object>} Saved search
 */
const saveUserSearch = async (userId, searchParams, name = null) => {
  try {
    const savedSearch = await SavedSearch.create({
      user: userId,
      name: name || "Untitled Search",
      filters: searchParams,
      isActive: true,
    });

    return savedSearch;
  } catch (error) {
    throw new Error(`Failed to save search: ${error.message}`);
  }
};

/**
 * Get user's saved searches
 * @param {String} userId - User ID
 * @returns {Promise<Array>} Saved searches
 */
const getSavedSearches = async (userId) => {
  try {
    const savedSearches = await SavedSearch.find({
      user: userId,
      isActive: true,
    })
      .sort("-createdAt")
      .lean();

    return savedSearches;
  } catch (error) {
    throw new Error(`Failed to get saved searches: ${error.message}`);
  }
};

/**
 * Delete saved search
 * @param {String} searchId - Saved search ID
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Deletion result
 */
const deleteSavedSearch = async (searchId, userId) => {
  try {
    const savedSearch = await SavedSearch.findOne({
      _id: searchId,
      user: userId,
    });

    if (!savedSearch) {
      throw new Error("Saved search not found");
    }

    savedSearch.isActive = false;
    await savedSearch.save();

    return {
      message: "Saved search deleted successfully",
      searchId: savedSearch._id,
    };
  } catch (error) {
    throw new Error(`Failed to delete saved search: ${error.message}`);
  }
};

/**
 * Get nearby properties
 * @param {Number} latitude - Latitude
 * @param {Number} longitude - Longitude
 * @param {Number} radiusKm - Radius in kilometers
 * @param {Number} limit - Number of properties
 * @returns {Promise<Array>} Nearby properties
 */
const getNearbyProperties = async (
  latitude,
  longitude,
  radiusKm = 5,
  limit = 20
) => {
  try {
    const radiusInMeters = radiusKm * 1000;

    const properties = await Property.find({
      isActive: true,
      status: "active",
      "location.coordinates": {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusInMeters,
        },
      },
    })
      .populate("seller", "name email phone avatar")
      .limit(limit)
      .lean();

    return properties;
  } catch (error) {
    throw new Error(`Failed to get nearby properties: ${error.message}`);
  }
};

/**
 * Get properties by price range suggestions
 * @returns {Promise<Array>} Price range categories
 */
const getPriceRangeCategories = async () => {
  try {
    const categories = [
      { label: "Under ₹50 Lakhs", min: 0, max: 5000000 },
      { label: "₹50L - ₹75L", min: 5000000, max: 7500000 },
      { label: "₹75L - ₹1 Crore", min: 7500000, max: 10000000 },
      { label: "₹1 Cr - ₹2 Cr", min: 10000000, max: 20000000 },
      { label: "Above ₹2 Crore", min: 20000000, max: null },
    ];

    // Get count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const query = {
          isActive: true,
          status: "active",
          price: { $gte: category.min },
        };

        if (category.max) {
          query.price.$lte = category.max;
        }

        const count = await Property.countDocuments(query);

        return {
          ...category,
          count,
        };
      })
    );

    return categoriesWithCount;
  } catch (error) {
    throw new Error(`Failed to get price range categories: ${error.message}`);
  }
};

/**
 * Get property count by location
 * @param {String} city - City name
 * @returns {Promise<Array>} Locations with property counts
 */
const getPropertyCountByLocation = async (city) => {
  try {
    const query = { isActive: true, status: "active" };

    if (city) {
      query.city = new RegExp(city, "i");
    }

    const locations = await Property.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$location",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          types: { $addToSet: "$type" },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 20,
      },
    ]);

    return locations;
  } catch (error) {
    throw new Error(
      `Failed to get property count by location: ${error.message}`
    );
  }
};

module.exports = {
  searchProperties,
  getSearchSuggestions,
  getPopularSearches,
  getSearchFilters,
  saveUserSearch,
  getSavedSearches,
  deleteSavedSearch,
  getNearbyProperties,
  getPriceRangeCategories,
  getPropertyCountByLocation,
};
