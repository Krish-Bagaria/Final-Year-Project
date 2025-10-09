const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
      index: true,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      trim: true,
    },
    interested: {
      type: Boolean,
      default: true,
      index: true,
    },
    interestedLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: [30, "Tag cannot exceed 30 characters"],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    viewedAt: {
      type: Date,
      default: Date.now,
    },
    lastViewedAt: {
      type: Date,
      default: Date.now,
    },
    viewCount: {
      type: Number,
      default: 1,
      min: 0,
    },
    reminderDate: {
      type: Date,
      default: null,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound Index - Ensure a user can't favorite the same property twice
favoriteSchema.index({ user: 1, property: 1 }, { unique: true });

// Index for queries
favoriteSchema.index({ user: 1, isActive: 1, createdAt: -1 });
favoriteSchema.index({ property: 1, interested: 1 });

// Virtual for time since favorited
favoriteSchema.virtual("daysSinceFavorited").get(function () {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Pre-save middleware - Update lastViewedAt
favoriteSchema.pre("save", function (next) {
  if (this.isModified("viewCount")) {
    this.lastViewedAt = Date.now();
  }
  next();
});

// Static method - Get user's favorites with property details
favoriteSchema.statics.getUserFavorites = async function (
  userId,
  options = {}
) {
  const {
    page = 1,
    limit = 10,
    sortBy = "-createdAt",
    interested = true,
    isActive = true,
  } = options;

  const skip = (page - 1) * limit;

  const query = {
    user: userId,
    isActive: isActive,
  };

  if (interested !== undefined) {
    query.interested = interested;
  }

  const favorites = await this.find(query)
    .populate({
      path: "property",
      select:
        "title type price area bedrooms images location status isActive isFeatured isVerified viewCount",
      match: { isActive: true },
    })
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  // Filter out favorites where property no longer exists
  const validFavorites = favorites.filter((fav) => fav.property !== null);

  const total = await this.countDocuments(query);

  return {
    favorites: validFavorites,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

// Static method - Check if property is favorited by user
favoriteSchema.statics.isFavorited = async function (userId, propertyId) {
  const favorite = await this.findOne({
    user: userId,
    property: propertyId,
    isActive: true,
  });
  return !!favorite;
};

// Static method - Get favorite count for a property
favoriteSchema.statics.getPropertyFavoriteCount = async function (propertyId) {
  return await this.countDocuments({
    property: propertyId,
    isActive: true,
    interested: true,
  });
};

// Static method - Get user's favorite properties by type
favoriteSchema.statics.getFavoritesByType = async function (userId) {
  const favorites = await this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        isActive: true,
        interested: true,
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
      $match: {
        "propertyDetails.isActive": true,
      },
    },
    {
      $group: {
        _id: "$propertyDetails.type",
        count: { $sum: 1 },
        properties: { $push: "$propertyDetails" },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  return favorites;
};

// Instance method - Toggle favorite status
favoriteSchema.methods.toggleInterested = async function () {
  this.interested = !this.interested;
  return await this.save();
};

// Instance method - Add note
favoriteSchema.methods.addNote = async function (note) {
  this.notes = note;
  return await this.save();
};

// Instance method - Increment view count
favoriteSchema.methods.incrementViewCount = async function () {
  this.viewCount += 1;
  this.lastViewedAt = Date.now();
  return await this.save();
};

// Instance method - Set reminder
favoriteSchema.methods.setReminder = async function (date) {
  this.reminderDate = date;
  this.reminderSent = false;
  return await this.save();
};

// Instance method - Soft delete
favoriteSchema.methods.softDelete = async function () {
  this.isActive = false;
  return await this.save();
};

// Static method - Clean up favorites for deleted properties
favoriteSchema.statics.cleanupDeletedProperties = async function () {
  const Property = mongoose.model("Property");

  const favorites = await this.find({ isActive: true }).select("property");
  const propertyIds = favorites.map((fav) => fav.property);

  const existingProperties = await Property.find({
    _id: { $in: propertyIds },
  }).select("_id");

  const existingPropertyIds = existingProperties.map((prop) =>
    prop._id.toString()
  );

  const favoritesToDelete = favorites.filter(
    (fav) => !existingPropertyIds.includes(fav.property.toString())
  );

  if (favoritesToDelete.length > 0) {
    await this.updateMany(
      { _id: { $in: favoritesToDelete.map((f) => f._id) } },
      { isActive: false }
    );
  }

  return favoritesToDelete.length;
};

// Static method - Get favorites due for reminder
favoriteSchema.statics.getFavoritesForReminder = async function () {
  const now = new Date();
  return await this.find({
    isActive: true,
    reminderDate: { $lte: now },
    reminderSent: false,
  })
    .populate("user", "name email phone")
    .populate("property", "title price location type");
};

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
