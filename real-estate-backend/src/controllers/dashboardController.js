const Property = require("../models/Property");
const Favorite = require("../models/Favorite");
const Inquiry = require("../models/Inquiry");
const PropertyView = require("../models/PropertyView");
const { userDashboardPipeline } = require("../utils/aggregationPipelines");

/**
 * @route   GET /api/dashboard/buyer
 * @desc    Get buyer dashboard data
 * @access  Private (Buyer)
 */
const getBuyerDashboard = async (req, res) => {
  try {
    const buyerId = req.user.id;

    // Get favorite properties count
    const favoritesCount = await Favorite.countDocuments({
      user: buyerId,
      isActive: true,
      interested: true,
    });

    // Get recent favorites (last 6)
    const recentFavorites = await Favorite.find({
      user: buyerId,
      isActive: true,
    })
      .populate(
        "property",
        "title type price area bedrooms location city images status isFeatured isVerified"
      )
      .sort("-createdAt")
      .limit(6)
      .lean();

    // Get sent inquiries count
    const inquiriesCount = await Inquiry.countDocuments({
      buyer: buyerId,
      isActive: true,
    });

    // Get recent inquiries (last 6)
    const recentInquiries = await Inquiry.find({
      buyer: buyerId,
      isActive: true,
    })
      .populate("property", "title type price location city images")
      .populate("seller", "name email phone")
      .sort("-createdAt")
      .limit(6)
      .lean();

    // Get inquiry status breakdown
    const inquiryStatusCount = await Inquiry.aggregate([
      {
        $match: {
          buyer: buyerId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get favorites by property type
    const favoritesByType = await Favorite.getFavoritesByType(buyerId);

    // Get recent property views
    const recentViews = await PropertyView.find({
      viewer: buyerId,
      isUnique: true,
    })
      .populate("property", "title type price location city images")
      .sort("-viewedAt")
      .limit(6)
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          favoritesCount,
          inquiriesCount,
          recentViewsCount: recentViews.length,
        },
        recentFavorites,
        recentInquiries,
        inquiryStatusCount,
        favoritesByType,
        recentViews,
      },
    });
  } catch (error) {
    console.error("Get buyer dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch buyer dashboard",
    });
  }
};

/**
 * @route   GET /api/dashboard/seller
 * @desc    Get seller dashboard data
 * @access  Private (Seller)
 */
const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Get property statistics
    const totalProperties = await Property.countDocuments({
      seller: sellerId,
      isActive: true,
    });

    const activeProperties = await Property.countDocuments({
      seller: sellerId,
      isActive: true,
      status: "active",
    });

    const soldProperties = await Property.countDocuments({
      seller: sellerId,
      isActive: true,
      status: "sold",
    });

    // Get total views
    const viewsStats = await Property.aggregate([
      {
        $match: {
          seller: sellerId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewCount" },
          uniqueViews: { $sum: "$uniqueViews" },
        },
      },
    ]);

    // Get recent properties (last 6)
    const recentProperties = await Property.find({
      seller: sellerId,
      isActive: true,
    })
      .sort("-createdAt")
      .limit(6)
      .lean();

    // Get inquiry statistics
    const totalInquiries = await Inquiry.countDocuments({
      seller: sellerId,
      isActive: true,
    });

    const unreadInquiries = await Inquiry.countDocuments({
      seller: sellerId,
      isActive: true,
      isRead: false,
    });

    const pendingInquiries = await Inquiry.countDocuments({
      seller: sellerId,
      isActive: true,
      status: "pending",
    });

    // Get recent inquiries (last 6)
    const recentInquiries = await Inquiry.find({
      seller: sellerId,
      isActive: true,
    })
      .populate("property", "title type price location city")
      .populate("buyer", "name email phone avatar")
      .sort("-createdAt")
      .limit(6)
      .lean();

    // Get hot inquiries (high priority, unread, last 24 hours)
    const hotInquiries = await Inquiry.getHotInquiries(sellerId);

    // Get inquiry status breakdown
    const inquiryStatusCount = await Inquiry.aggregate([
      {
        $match: {
          seller: sellerId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get properties by status
    const propertiesByStatus = await Property.aggregate([
      {
        $match: {
          seller: sellerId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get top performing properties
    const topProperties = await Property.find({
      seller: sellerId,
      isActive: true,
    })
      .sort("-viewCount -uniqueViews")
      .limit(5)
      .select("title type price viewCount uniqueViews location")
      .lean();

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProperties,
          activeProperties,
          soldProperties,
          totalViews: viewsStats[0]?.totalViews || 0,
          uniqueViews: viewsStats[0]?.uniqueViews || 0,
          totalInquiries,
          unreadInquiries,
          pendingInquiries,
        },
        recentProperties,
        recentInquiries,
        hotInquiries,
        inquiryStatusCount,
        propertiesByStatus,
        topProperties,
      },
    });
  } catch (error) {
    console.error("Get seller dashboard error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch seller dashboard",
    });
  }
};

/**
 * @route   GET /api/dashboard/analytics
 * @desc    Get detailed analytics (seller)
 * @access  Private (Seller)
 */
const getDetailedAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { period = "30" } = req.query; // days

    const daysAgo = new Date(
      Date.now() - parseInt(period) * 24 * 60 * 60 * 1000
    );

    // Property performance over time
    const propertyPerformance = await Property.aggregate([
      {
        $match: {
          seller: sellerId,
          isActive: true,
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          totalViews: { $sum: "$viewCount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Inquiry trends over time
    const inquiryTrends = await Inquiry.aggregate([
      {
        $match: {
          seller: sellerId,
          isActive: true,
          createdAt: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Property type distribution
    const propertyTypeDistribution = await Property.aggregate([
      {
        $match: {
          seller: sellerId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          totalViews: { $sum: "$viewCount" },
        },
      },
    ]);

    // Average response time
    const responseTimeStats = await Inquiry.aggregate([
      {
        $match: {
          seller: sellerId,
          isActive: true,
          respondedAt: { $ne: null },
        },
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
    ]);

    // Conversion metrics
    const totalInquiries = await Inquiry.countDocuments({
      seller: sellerId,
      isActive: true,
    });

    const completedInquiries = await Inquiry.countDocuments({
      seller: sellerId,
      isActive: true,
      status: "completed",
    });

    const conversionRate =
      totalInquiries > 0
        ? ((completedInquiries / totalInquiries) * 100).toFixed(2)
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        period: parseInt(period),
        propertyPerformance,
        inquiryTrends,
        propertyTypeDistribution,
        responseTime: {
          avgResponseTime: responseTimeStats[0]?.avgResponseTime || 0,
          avgResponseTimeHours: responseTimeStats[0]?.avgResponseTime
            ? (responseTimeStats[0].avgResponseTime / (1000 * 60 * 60)).toFixed(
                2
              )
            : 0,
        },
        conversionMetrics: {
          totalInquiries,
          completedInquiries,
          conversionRate: parseFloat(conversionRate),
        },
      },
    });
  } catch (error) {
    console.error("Get detailed analytics error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch analytics",
    });
  }
};

/**
 * @route   GET /api/dashboard/overview
 * @desc    Get quick overview (for home page)
 * @access  Private
 */
const getQuickOverview = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const overview = {};

    // Buyer stats
    if (userRole === "buyer" || userRole === "both") {
      overview.buyer = {
        favoritesCount: await Favorite.countDocuments({
          user: userId,
          isActive: true,
        }),
        inquiriesSent: await Inquiry.countDocuments({
          buyer: userId,
          isActive: true,
        }),
      };
    }

    // Seller stats
    if (userRole === "seller" || userRole === "both") {
      overview.seller = {
        totalProperties: await Property.countDocuments({
          seller: userId,
          isActive: true,
        }),
        activeProperties: await Property.countDocuments({
          seller: userId,
          isActive: true,
          status: "active",
        }),
        unreadInquiries: await Inquiry.countDocuments({
          seller: userId,
          isActive: true,
          isRead: false,
        }),
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        overview,
        role: userRole,
      },
    });
  } catch (error) {
    console.error("Get quick overview error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch overview",
    });
  }
};

/**
 * @route   GET /api/dashboard/notifications
 * @desc    Get user notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const notifications = [];

    // Check for unread inquiries (seller)
    if (userRole === "seller" || userRole === "both") {
      const unreadCount = await Inquiry.countDocuments({
        seller: userId,
        isActive: true,
        isRead: false,
      });

      if (unreadCount > 0) {
        notifications.push({
          type: "inquiry",
          message: `You have ${unreadCount} unread ${
            unreadCount === 1 ? "inquiry" : "inquiries"
          }`,
          count: unreadCount,
          link: "/dashboard/seller/inquiries",
        });
      }

      // Check for pending inquiries
      const pendingCount = await Inquiry.countDocuments({
        seller: userId,
        isActive: true,
        status: "pending",
      });

      if (pendingCount > 0) {
        notifications.push({
          type: "pending_inquiry",
          message: `${pendingCount} ${
            pendingCount === 1 ? "inquiry needs" : "inquiries need"
          } your attention`,
          count: pendingCount,
          link: "/dashboard/seller/inquiries?status=pending",
        });
      }
    }

    // Check for inquiry responses (buyer)
    if (userRole === "buyer" || userRole === "both") {
      const respondedInquiries = await Inquiry.countDocuments({
        buyer: userId,
        isActive: true,
        response: { $ne: null },
        status: "contacted",
      });

      if (respondedInquiries > 0) {
        notifications.push({
          type: "inquiry_response",
          message: `You have ${respondedInquiries} new ${
            respondedInquiries === 1 ? "response" : "responses"
          } to your inquiries`,
          count: respondedInquiries,
          link: "/dashboard/buyer/inquiries",
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        notifications,
        count: notifications.length,
      },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch notifications",
    });
  }
};

module.exports = {
  getBuyerDashboard,
  getSellerDashboard,
  getDetailedAnalytics,
  getQuickOverview,
  getNotifications,
};
