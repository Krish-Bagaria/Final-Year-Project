const mongoose = require("mongoose");

/**
 * Property search aggregation pipeline
 * @param {Object} filters - Search filters
 * @returns {Array} Aggregation pipeline
 */
const propertySearchPipeline = (filters) => {
  const {
    query,
    type,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    minBedrooms,
    maxBedrooms,
    city,
    location,
    amenities,
    isFeatured,
    isVerified,
  } = filters;

  const pipeline = [];

  // Match stage
  const matchStage = {
    isActive: true,
    status: "active",
  };

  if (query) {
    matchStage.$text = { $search: query };
  }

  if (type) matchStage.type = type;
  if (city) matchStage.city = new RegExp(city, "i");
  if (location) matchStage.location = new RegExp(location, "i");
  if (isFeatured !== undefined) matchStage.isFeatured = isFeatured;
  if (isVerified !== undefined) matchStage.isVerified = isVerified;

  // Price range
  if (minPrice || maxPrice) {
    matchStage.price = {};
    if (minPrice) matchStage.price.$gte = parseInt(minPrice);
    if (maxPrice) matchStage.price.$lte = parseInt(maxPrice);
  }

  // Area range
  if (minArea || maxArea) {
    matchStage.area = {};
    if (minArea) matchStage.area.$gte = parseInt(minArea);
    if (maxArea) matchStage.area.$lte = parseInt(maxArea);
  }

  // Bedroom range
  if (minBedrooms || maxBedrooms) {
    matchStage.bedrooms = {};
    if (minBedrooms) matchStage.bedrooms.$gte = parseInt(minBedrooms);
    if (maxBedrooms) matchStage.bedrooms.$lte = parseInt(maxBedrooms);
  }

  // Amenities (must have all)
  if (amenities && amenities.length > 0) {
    matchStage.amenities = { $all: amenities };
  }

  pipeline.push({ $match: matchStage });

  // Add text score if text search
  if (query) {
    pipeline.push({
      $addFields: {
        score: { $meta: "textScore" },
      },
    });
  }

  return pipeline;
};

/**
 * Property analytics aggregation pipeline
 * @param {String} sellerId - Seller ID
 * @returns {Array} Aggregation pipeline
 */
const propertyAnalyticsPipeline = (sellerId) => {
  return [
    {
      $match: {
        seller: mongoose.Types.ObjectId(sellerId),
        isActive: true,
      },
    },
    {
      $facet: {
        // Properties by status
        statusCount: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
        // Properties by type
        typeCount: [
          {
            $group: {
              _id: "$type",
              count: { $sum: 1 },
            },
          },
        ],
        // Overall statistics
        totalStats: [
          {
            $group: {
              _id: null,
              totalProperties: { $sum: 1 },
              totalViews: { $sum: "$viewCount" },
              uniqueViews: { $sum: "$uniqueViews" },
              featuredCount: { $sum: { $cond: ["$isFeatured", 1, 0] } },
              verifiedCount: { $sum: { $cond: ["$isVerified", 1, 0] } },
            },
          },
        ],
        // Price statistics
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
        // Area statistics
        areaStats: [
          {
            $group: {
              _id: null,
              avgArea: { $avg: "$area" },
              minArea: { $min: "$area" },
              maxArea: { $max: "$area" },
            },
          },
        ],
        // Most viewed properties
        topProperties: [
          {
            $sort: { viewCount: -1 },
          },
          {
            $limit: 5,
          },
          {
            $project: {
              title: 1,
              type: 1,
              price: 1,
              viewCount: 1,
              uniqueViews: 1,
            },
          },
        ],
      },
    },
  ];
};

/**
 * Trending properties pipeline
 * @param {Number} days - Days to look back
 * @param {Number} limit - Number of properties
 * @returns {Array} Aggregation pipeline
 */
const trendingPropertiesPipeline = (days = 7, limit = 10) => {
  const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  return [
    {
      $match: {
        isActive: true,
        status: "active",
        createdAt: { $gte: dateThreshold },
      },
    },
    {
      $addFields: {
        trendScore: {
          $add: [
            { $multiply: ["$viewCount", 1] },
            { $multiply: ["$uniqueViews", 2] },
          ],
        },
      },
    },
    {
      $sort: { trendScore: -1, viewCount: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "seller",
      },
    },
    {
      $unwind: "$seller",
    },
    {
      $project: {
        title: 1,
        type: 1,
        price: 1,
        area: 1,
        bedrooms: 1,
        location: 1,
        city: 1,
        images: 1,
        viewCount: 1,
        uniqueViews: 1,
        isFeatured: 1,
        isVerified: 1,
        "seller.name": 1,
        "seller.email": 1,
        "seller.phone": 1,
        "seller.avatar": 1,
      },
    },
  ];
};

/**
 * User dashboard analytics pipeline
 * @param {String} userId - User ID
 * @returns {Object} Pipelines for buyer and seller
 */
const userDashboardPipeline = (userId) => {
  return {
    // Buyer dashboard pipeline
    buyer: [
      {
        $facet: {
          // Favorite properties
          favorites: [
            {
              $lookup: {
                from: "favorites",
                let: { userId: mongoose.Types.ObjectId(userId) },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$user", "$$userId"] },
                          { $eq: ["$isActive", true] },
                        ],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: "properties",
                      localField: "property",
                      foreignField: "_id",
                      as: "propertyDetails",
                    },
                  },
                  {
                    $unwind: "$propertyDetails",
                  },
                  {
                    $sort: { createdAt: -1 },
                  },
                  {
                    $limit: 10,
                  },
                ],
                as: "favoritesList",
              },
            },
          ],
          // Sent inquiries
          inquiries: [
            {
              $lookup: {
                from: "inquiries",
                let: { userId: mongoose.Types.ObjectId(userId) },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$buyer", "$$userId"] },
                          { $eq: ["$isActive", true] },
                        ],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: "properties",
                      localField: "property",
                      foreignField: "_id",
                      as: "propertyDetails",
                    },
                  },
                  {
                    $sort: { createdAt: -1 },
                  },
                  {
                    $limit: 10,
                  },
                ],
                as: "inquiriesList",
              },
            },
          ],
        },
      },
    ],
    // Seller dashboard pipeline
    seller: [
      {
        $facet: {
          // Property statistics
          propertyStats: [
            {
              $lookup: {
                from: "properties",
                let: { userId: mongoose.Types.ObjectId(userId) },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$seller", "$$userId"] },
                          { $eq: ["$isActive", true] },
                        ],
                      },
                    },
                  },
                  {
                    $group: {
                      _id: null,
                      total: { $sum: 1 },
                      active: {
                        $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
                      },
                      sold: {
                        $sum: { $cond: [{ $eq: ["$status", "sold"] }, 1, 0] },
                      },
                      totalViews: { $sum: "$viewCount" },
                      uniqueViews: { $sum: "$uniqueViews" },
                    },
                  },
                ],
                as: "stats",
              },
            },
          ],
          // Recent inquiries
          recentInquiries: [
            {
              $lookup: {
                from: "inquiries",
                let: { userId: mongoose.Types.ObjectId(userId) },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$seller", "$$userId"] },
                          { $eq: ["$isActive", true] },
                        ],
                      },
                    },
                  },
                  {
                    $sort: { createdAt: -1 },
                  },
                  {
                    $limit: 10,
                  },
                ],
                as: "inquiries",
              },
            },
          ],
        },
      },
    ],
  };
};

/**
 * Property recommendations pipeline
 * @param {String} propertyId - Current property ID
 * @param {Object} criteria - Recommendation criteria
 * @returns {Array} Aggregation pipeline
 */
const propertyRecommendationsPipeline = (propertyId, criteria) => {
  const { type, city, minPrice, maxPrice } = criteria;

  return [
    {
      $match: {
        _id: { $ne: mongoose.Types.ObjectId(propertyId) },
        isActive: true,
        status: "active",
        type: type,
        city: new RegExp(city, "i"),
        price: {
          $gte: minPrice * 0.7,
          $lte: maxPrice * 1.3,
        },
      },
    },
    {
      $addFields: {
        similarityScore: {
          $add: [
            { $cond: [{ $eq: ["$type", type] }, 10, 0] },
            { $cond: [{ $eq: ["$city", city] }, 5, 0] },
            {
              $cond: [
                {
                  $and: [
                    { $gte: ["$price", minPrice * 0.9] },
                    { $lte: ["$price", maxPrice * 1.1] },
                  ],
                },
                5,
                0,
              ],
            },
          ],
        },
      },
    },
    {
      $sort: { similarityScore: -1, viewCount: -1 },
    },
    {
      $limit: 4,
    },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "seller",
      },
    },
    {
      $unwind: "$seller",
    },
  ];
};

/**
 * Location-based property aggregation
 * @param {String} city - City name
 * @returns {Array} Aggregation pipeline
 */
const locationStatsPipeline = (city) => {
  const pipeline = [
    {
      $match: {
        isActive: true,
        status: "active",
      },
    },
  ];

  if (city) {
    pipeline[0].$match.city = new RegExp(city, "i");
  }

  pipeline.push(
    {
      $group: {
        _id: "$location",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
        types: { $addToSet: "$type" },
        totalViews: { $sum: "$viewCount" },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 20,
    }
  );

  return pipeline;
};

/**
 * Price range statistics pipeline
 * @returns {Array} Aggregation pipeline
 */
const priceRangeStatsPipeline = () => {
  return [
    {
      $match: {
        isActive: true,
        status: "active",
      },
    },
    {
      $bucket: {
        groupBy: "$price",
        boundaries: [0, 5000000, 7500000, 10000000, 20000000, Infinity],
        default: "Other",
        output: {
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          properties: {
            $push: {
              id: "$_id",
              title: "$title",
              type: "$type",
              price: "$price",
            },
          },
        },
      },
    },
  ];
};

/**
 * Inquiry analytics pipeline
 * @param {String} sellerId - Seller ID
 * @returns {Array} Aggregation pipeline
 */
const inquiryAnalyticsPipeline = (sellerId) => {
  return [
    {
      $match: {
        seller: mongoose.Types.ObjectId(sellerId),
        isActive: true,
      },
    },
    {
      $facet: {
        // Status breakdown
        statusCount: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
        // Priority breakdown
        priorityCount: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
        ],
        // Unread count
        unreadCount: [
          {
            $match: { isRead: false },
          },
          {
            $count: "count",
          },
        ],
        // Response time analysis
        responseTime: [
          {
            $match: { respondedAt: { $ne: null } },
          },
          {
            $project: {
              responseTime: {
                $subtract: ["$respondedAt", "$createdAt"],
              },
            },
          },
          {
            $group: {
              _id: null,
              avgResponseTime: { $avg: "$responseTime" },
              minResponseTime: { $min: "$responseTime" },
              maxResponseTime: { $max: "$responseTime" },
            },
          },
        ],
        // Recent inquiries
        recentInquiries: [
          {
            $sort: { createdAt: -1 },
          },
          {
            $limit: 10,
          },
          {
            $lookup: {
              from: "properties",
              localField: "property",
              foreignField: "_id",
              as: "property",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "buyer",
              foreignField: "_id",
              as: "buyer",
            },
          },
        ],
      },
    },
  ];
};

/**
 * Amenities popularity pipeline
 * @returns {Array} Aggregation pipeline
 */
const amenitiesPopularityPipeline = () => {
  return [
    {
      $match: {
        isActive: true,
        status: "active",
      },
    },
    {
      $unwind: "$amenities",
    },
    {
      $group: {
        _id: "$amenities",
        count: { $sum: 1 },
        avgPrice: { $avg: "$price" },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 20,
    },
  ];
};

module.exports = {
  propertySearchPipeline,
  propertyAnalyticsPipeline,
  trendingPropertiesPipeline,
  userDashboardPipeline,
  propertyRecommendationsPipeline,
  locationStatsPipeline,
  priceRangeStatsPipeline,
  inquiryAnalyticsPipeline,
  amenitiesPopularityPipeline,
};
