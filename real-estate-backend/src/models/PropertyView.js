const mongoose = require("mongoose");

const propertyViewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
      index: true,
    },
    viewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    device: {
      type: {
        type: String,
        enum: ["desktop", "mobile", "tablet", "unknown"],
        default: "unknown",
      },
      browser: {
        type: String,
        trim: true,
      },
      os: {
        type: String,
        trim: true,
      },
    },
    location: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
        default: "India",
      },
      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0],
        },
      },
    },
    referrer: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: [
        "direct",
        "search",
        "featured",
        "trending",
        "similar",
        "profile",
        "favorites",
        "notification",
        "external",
        "other",
      ],
      default: "direct",
      index: true,
    },
    searchQuery: {
      type: String,
      trim: true,
    },
    viewDuration: {
      type: Number, // in seconds
      default: 0,
      min: 0,
    },
    scrollDepth: {
      type: Number, // percentage 0-100
      default: 0,
      min: 0,
      max: 100,
    },
    interactions: {
      imageViews: {
        type: Number,
        default: 0,
        min: 0,
      },
      imageGalleryOpened: {
        type: Boolean,
        default: false,
      },
      mapViewed: {
        type: Boolean,
        default: false,
      },
      contactClicked: {
        type: Boolean,
        default: false,
      },
      phoneRevealed: {
        type: Boolean,
        default: false,
      },
      whatsappClicked: {
        type: Boolean,
        default: false,
      },
      shareClicked: {
        type: Boolean,
        default: false,
      },
      favorited: {
        type: Boolean,
        default: false,
      },
      inquirySent: {
        type: Boolean,
        default: false,
      },
    },
    bounced: {
      type: Boolean,
      default: false,
      index: true,
    },
    isUnique: {
      type: Boolean,
      default: true,
      index: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    exitedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for analytics queries
propertyViewSchema.index({ property: 1, viewedAt: -1 });
propertyViewSchema.index({ viewer: 1, property: 1, viewedAt: -1 });
propertyViewSchema.index({ property: 1, isUnique: 1, viewedAt: -1 });
propertyViewSchema.index({ property: 1, source: 1 });
propertyViewSchema.index({ sessionId: 1, property: 1 });
propertyViewSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

// Geospatial index for location-based analytics
propertyViewSchema.index({ "location.coordinates": "2dsphere" });

// Virtual for engagement score (0-100)
propertyViewSchema.virtual("engagementScore").get(function () {
  let score = 0;

  // View duration (max 30 points)
  if (this.viewDuration > 0) {
    score += Math.min(30, (this.viewDuration / 300) * 30); // 5 mins = 30 points
  }

  // Scroll depth (max 20 points)
  score += (this.scrollDepth / 100) * 20;

  // Interactions (50 points total)
  const interactions = this.interactions;
  if (interactions.imageGalleryOpened) score += 5;
  if (interactions.mapViewed) score += 5;
  if (interactions.contactClicked) score += 10;
  if (interactions.phoneRevealed) score += 8;
  if (interactions.whatsappClicked) score += 7;
  if (interactions.favorited) score += 10;
  if (interactions.inquirySent) score += 15;

  return Math.min(100, Math.round(score));
});

// Virtual for is high intent
propertyViewSchema.virtual("isHighIntent").get(function () {
  return (
    this.engagementScore >= 60 ||
    this.interactions.inquirySent ||
    this.interactions.phoneRevealed
  );
});

// Pre-save middleware - Set bounced flag
propertyViewSchema.pre("save", function (next) {
  // Consider bounced if view duration < 10 seconds and no interactions
  if (this.viewDuration < 10 && this.engagementScore < 10) {
    this.bounced = true;
  }
  next();
});

// Static method - Record a view
propertyViewSchema.statics.recordView = async function (viewData) {
  const {
    propertyId,
    userId = null,
    sessionId,
    ipAddress,
    userAgent,
    device,
    location,
    referrer,
    source = "direct",
    searchQuery,
  } = viewData;

  // Check if this is a unique view (same user/session hasn't viewed in last 24 hours)
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentView = await this.findOne({
    property: propertyId,
    $or: [{ viewer: userId, viewer: { $ne: null } }, { sessionId: sessionId }],
    viewedAt: { $gte: oneDayAgo },
  });

  const isUnique = !recentView;

  const view = await this.create({
    property: propertyId,
    viewer: userId,
    sessionId,
    ipAddress,
    userAgent,
    device,
    location,
    referrer,
    source,
    searchQuery,
    isUnique,
    viewedAt: Date.now(),
  });

  // Update property view count if unique
  if (isUnique) {
    await mongoose.model("Property").findByIdAndUpdate(propertyId, {
      $inc: { viewCount: 1, uniqueViews: 1 },
    });
  } else {
    await mongoose
      .model("Property")
      .findByIdAndUpdate(propertyId, { $inc: { viewCount: 1 } });
  }

  return view;
};

// Static method - Update view interaction
propertyViewSchema.statics.updateInteraction = async function (
  viewId,
  interaction
) {
  const updateObj = {};
  updateObj[`interactions.${interaction}`] = true;

  return await this.findByIdAndUpdate(
    viewId,
    { $set: updateObj },
    { new: true }
  );
};

// Static method - End view session
propertyViewSchema.statics.endViewSession = async function (
  viewId,
  duration,
  scrollDepth
) {
  return await this.findByIdAndUpdate(
    viewId,
    {
      viewDuration: duration,
      scrollDepth: scrollDepth,
      exitedAt: Date.now(),
    },
    { new: true }
  );
};

// Static method - Get property analytics
propertyViewSchema.statics.getPropertyAnalytics = async function (
  propertyId,
  options = {}
) {
  const {
    startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    endDate = new Date(),
  } = options;

  const analytics = await this.aggregate([
    {
      $match: {
        property: mongoose.Types.ObjectId(propertyId),
        viewedAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $facet: {
        overview: [
          {
            $group: {
              _id: null,
              totalViews: { $sum: 1 },
              uniqueViews: { $sum: { $cond: ["$isUnique", 1, 0] } },
              avgDuration: { $avg: "$viewDuration" },
              avgScrollDepth: { $avg: "$scrollDepth" },
              bounceRate: {
                $avg: { $cond: ["$bounced", 1, 0] },
              },
              totalInquiries: {
                $sum: { $cond: ["$interactions.inquirySent", 1, 0] },
              },
              totalFavorites: {
                $sum: { $cond: ["$interactions.favorited", 1, 0] },
              },
              contactClicks: {
                $sum: { $cond: ["$interactions.contactClicked", 1, 0] },
              },
            },
          },
        ],
        viewsBySource: [
          {
            $group: {
              _id: "$source",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
        viewsByDevice: [
          {
            $group: {
              _id: "$device.type",
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
        dailyViews: [
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" },
              },
              views: { $sum: 1 },
              uniqueViews: { $sum: { $cond: ["$isUnique", 1, 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ],
        topLocations: [
          {
            $group: {
              _id: { city: "$location.city", state: "$location.state" },
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ],
        highIntentViewers: [
          {
            $match: {
              viewer: { $ne: null },
              $or: [
                { "interactions.inquirySent": true },
                { "interactions.phoneRevealed": true },
                { viewDuration: { $gte: 180 } },
              ],
            },
          },
          {
            $group: {
              _id: "$viewer",
              viewCount: { $sum: 1 },
              totalDuration: { $sum: "$viewDuration" },
              lastViewed: { $max: "$viewedAt" },
            },
          },
          { $sort: { lastViewed: -1 } },
          { $limit: 20 },
        ],
      },
    },
  ]);

  return analytics[0];
};

// Static method - Get trending properties (most viewed this week)
propertyViewSchema.statics.getTrendingProperties = async function (limit = 10) {
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return await this.aggregate([
    {
      $match: {
        viewedAt: { $gte: oneWeekAgo },
      },
    },
    {
      $group: {
        _id: "$property",
        viewCount: { $sum: 1 },
        uniqueViews: { $sum: { $cond: ["$isUnique", 1, 0] } },
        inquiries: { $sum: { $cond: ["$interactions.inquirySent", 1, 0] } },
      },
    },
    {
      $sort: { uniqueViews: -1, viewCount: -1 },
    },
    {
      $limit: limit,
    },
    {
      $lookup: {
        from: "properties",
        localField: "_id",
        foreignField: "_id",
        as: "property",
      },
    },
    {
      $unwind: "$property",
    },
    {
      $match: {
        "property.isActive": true,
      },
    },
  ]);
};

// Static method - Get viewer insights
propertyViewSchema.statics.getViewerInsights = async function (propertyId) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return await this.aggregate([
    {
      $match: {
        property: mongoose.Types.ObjectId(propertyId),
        viewedAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: null,
        avgEngagement: { $avg: "$scrollDepth" },
        peakHour: {
          $push: { $hour: "$viewedAt" },
        },
        repeatViewers: {
          $sum: { $cond: [{ $eq: ["$isUnique", false] }, 1, 0] },
        },
      },
    },
  ]);
};

// Instance method - Mark as high intent
propertyViewSchema.methods.markHighIntent = async function () {
  this.interactions.inquirySent = true;
  return await this.save();
};

const PropertyView = mongoose.model("PropertyView", propertyViewSchema);

module.exports = PropertyView;
