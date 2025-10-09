const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
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
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    area: {
      type: String,
      required: [true, "Area in Jaipur is required"],
      trim: true,
      maxlength: [100, "Area cannot exceed 100 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [10, "Title must be at least 10 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      minlength: [20, "Review must be at least 20 characters"],
      maxlength: [1000, "Review cannot exceed 1000 characters"],
    },
    testimonialType: {
      type: String,
      enum: ["buyer", "seller", "general"],
      default: "general",
      index: true,
    },
    experienceType: {
      type: String,
      enum: ["excellent", "good", "average", "poor"],
      required: true,
      index: true,
    },
    serviceRatings: {
      communication: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
      },
      professionalism: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
      },
      responseTime: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
      },
      accuracy: {
        type: Number,
        min: 1,
        max: 5,
        default: 5,
      },
    },
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?name=User&background=random",
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    isApproved: {
      type: Boolean,
      default: false,
      index: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    helpfulBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reportCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    reportedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reason: {
          type: String,
          trim: true,
        },
        reportedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [500, "Admin notes cannot exceed 500 characters"],
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, "Rejection reason cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged", "archived"],
      default: "pending",
      index: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    verifiedPurchase: {
      type: Boolean,
      default: false,
    },
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
testimonialSchema.index({ isApproved: 1, isFeatured: 1, rating: -1 });
testimonialSchema.index({ user: 1, property: 1 });
testimonialSchema.index({ status: 1, createdAt: -1 });
testimonialSchema.index({ testimonialType: 1, isApproved: 1 });

// Virtual for average service rating
testimonialSchema.virtual("averageServiceRating").get(function () {
  const ratings = this.serviceRatings;
  const sum =
    ratings.communication +
    ratings.professionalism +
    ratings.responseTime +
    ratings.accuracy;
  return (sum / 4).toFixed(1);
});

// Virtual for testimonial age (days)
testimonialSchema.virtual("testimonialAgeDays").get(function () {
  const now = new Date();
  const diffMs = now - this.createdAt;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
});

// Virtual for is recent (within 30 days)
testimonialSchema.virtual("isRecent").get(function () {
  return this.testimonialAgeDays <= 30;
});

// Pre-save middleware - Set experience type based on rating
testimonialSchema.pre("save", function (next) {
  if (this.isModified("rating")) {
    if (this.rating >= 4.5) {
      this.experienceType = "excellent";
    } else if (this.rating >= 3.5) {
      this.experienceType = "good";
    } else if (this.rating >= 2.5) {
      this.experienceType = "average";
    } else {
      this.experienceType = "poor";
    }
  }

  // Set published date when approved
  if (this.isModified("isApproved") && this.isApproved && !this.publishedAt) {
    this.publishedAt = Date.now();
    this.isPublished = true;
  }

  next();
});

// Static method - Get approved testimonials for homepage
testimonialSchema.statics.getHomepageTestimonials = async function (limit = 6) {
  return await this.find({
    isApproved: true,
    isPublished: true,
    isActive: true,
    status: "approved",
  })
    .populate("user", "name avatar")
    .populate("property", "title type")
    .sort({ isFeatured: -1, displayOrder: 1, rating: -1, createdAt: -1 })
    .limit(limit)
    .lean();
};

// Static method - Get all testimonials with filters (admin)
testimonialSchema.statics.getAllTestimonials = async function (options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    testimonialType,
    rating,
    isApproved,
    isFeatured,
    sortBy = "-createdAt",
  } = options;

  const skip = (page - 1) * limit;
  const query = { isActive: true };

  if (status) query.status = status;
  if (testimonialType) query.testimonialType = testimonialType;
  if (rating) query.rating = { $gte: rating };
  if (isApproved !== undefined) query.isApproved = isApproved;
  if (isFeatured !== undefined) query.isFeatured = isFeatured;

  const testimonials = await this.find(query)
    .populate("user", "name email avatar role")
    .populate("property", "title type price")
    .populate("approvedBy", "name")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await this.countDocuments(query);

  return {
    testimonials,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

// Static method - Get user's testimonials
testimonialSchema.statics.getUserTestimonials = async function (userId) {
  return await this.find({
    user: userId,
    isActive: true,
  })
    .populate("property", "title type price images")
    .sort("-createdAt")
    .lean();
};

// Static method - Get testimonials by property
testimonialSchema.statics.getPropertyTestimonials = async function (
  propertyId
) {
  return await this.find({
    property: propertyId,
    isApproved: true,
    isPublished: true,
    isActive: true,
  })
    .populate("user", "name avatar")
    .sort("-rating -createdAt")
    .lean();
};

// Static method - Get testimonial statistics
testimonialSchema.statics.getTestimonialStats = async function () {
  const stats = await this.aggregate([
    {
      $match: { isActive: true },
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
        ratingDistribution: [
          {
            $group: {
              _id: "$rating",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: -1 } },
        ],
        typeCount: [
          {
            $group: {
              _id: "$testimonialType",
              count: { $sum: 1 },
            },
          },
        ],
        averageRating: [
          {
            $group: {
              _id: null,
              avgRating: { $avg: "$rating" },
              totalTestimonials: { $sum: 1 },
            },
          },
        ],
        pendingCount: [
          {
            $match: { status: "pending" },
          },
          {
            $count: "count",
          },
        ],
        featuredCount: [
          {
            $match: { isFeatured: true, isApproved: true },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  return stats[0];
};

// Static method - Get featured testimonials
testimonialSchema.statics.getFeaturedTestimonials = async function () {
  return await this.find({
    isFeatured: true,
    isApproved: true,
    isPublished: true,
    isActive: true,
  })
    .populate("user", "name avatar")
    .populate("property", "title type location")
    .sort("displayOrder -rating -createdAt")
    .lean();
};

// Static method - Get pending testimonials for admin review
testimonialSchema.statics.getPendingTestimonials = async function () {
  return await this.find({
    status: "pending",
    isActive: true,
  })
    .populate("user", "name email phone role")
    .populate("property", "title type")
    .sort("-createdAt")
    .lean();
};

// Instance method - Approve testimonial
testimonialSchema.methods.approve = async function (adminId) {
  this.isApproved = true;
  this.approvedBy = adminId;
  this.approvedAt = Date.now();
  this.status = "approved";
  this.isPublished = true;
  this.publishedAt = Date.now();
  return await this.save();
};

// Instance method - Reject testimonial
testimonialSchema.methods.reject = async function (reason) {
  this.status = "rejected";
  this.rejectionReason = reason;
  this.isApproved = false;
  return await this.save();
};

// Instance method - Mark as featured
testimonialSchema.methods.markAsFeatured = async function (order = 0) {
  this.isFeatured = true;
  this.displayOrder = order;
  return await this.save();
};

// Instance method - Remove from featured
testimonialSchema.methods.removeFromFeatured = async function () {
  this.isFeatured = false;
  this.displayOrder = 0;
  return await this.save();
};

// Instance method - Mark as helpful
testimonialSchema.methods.markHelpful = async function (userId) {
  if (!this.helpfulBy.includes(userId)) {
    this.helpfulBy.push(userId);
    this.helpfulCount += 1;
    return await this.save();
  }
  return this;
};

// Instance method - Report testimonial
testimonialSchema.methods.report = async function (userId, reason) {
  // Check if user already reported
  const alreadyReported = this.reportedBy.some(
    (report) => report.user.toString() === userId.toString()
  );

  if (!alreadyReported) {
    this.reportedBy.push({
      user: userId,
      reason: reason,
      reportedAt: Date.now(),
    });
    this.reportCount += 1;

    // Auto-flag if reported 3+ times
    if (this.reportCount >= 3) {
      this.status = "flagged";
    }

    return await this.save();
  }
  return this;
};

// Instance method - Archive testimonial
testimonialSchema.methods.archive = async function () {
  this.status = "archived";
  this.isPublished = false;
  return await this.save();
};

// Instance method - Update display order
testimonialSchema.methods.updateDisplayOrder = async function (order) {
  this.displayOrder = order;
  return await this.save();
};

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonial;
