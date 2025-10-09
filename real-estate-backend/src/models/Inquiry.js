const mongoose = require("mongoose");

const inquirySchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
      index: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer is required"],
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
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [
        /^[6-9]\d{9}$/,
        "Please provide a valid 10-digit Indian phone number",
      ],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    inquiryType: {
      type: String,
      enum: ["general", "visit", "price_negotiation", "documentation", "other"],
      default: "general",
      index: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ["email", "phone", "whatsapp", "any"],
      default: "any",
    },
    preferredContactTime: {
      type: String,
      enum: ["morning", "afternoon", "evening", "anytime"],
      default: "anytime",
    },
    visitDate: {
      type: Date,
      default: null,
    },
    budget: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
    },
    status: {
      type: String,
      enum: [
        "pending",
        "contacted",
        "in_progress",
        "completed",
        "cancelled",
        "spam",
      ],
      default: "pending",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
    response: {
      type: String,
      trim: true,
      maxlength: [1000, "Response cannot exceed 1000 characters"],
    },
    respondedAt: {
      type: Date,
      default: null,
    },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    notes: [
      {
        note: {
          type: String,
          required: true,
          maxlength: [500, "Note cannot exceed 500 characters"],
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    source: {
      type: String,
      enum: ["website", "mobile_app", "direct", "referral"],
      default: "website",
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      maxlength: [500, "Feedback cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
inquirySchema.index({ seller: 1, status: 1, createdAt: -1 });
inquirySchema.index({ buyer: 1, createdAt: -1 });
inquirySchema.index({ property: 1, createdAt: -1 });
inquirySchema.index({ status: 1, priority: 1, createdAt: -1 });
inquirySchema.index({ isRead: 1, seller: 1 });

// Virtual for response time (in hours)
inquirySchema.virtual("responseTimeHours").get(function () {
  if (this.respondedAt && this.createdAt) {
    const diffMs = this.respondedAt - this.createdAt;
    return Math.round(diffMs / (1000 * 60 * 60));
  }
  return null;
});

// Virtual for inquiry age (in days)
inquirySchema.virtual("inquiryAgeDays").get(function () {
  const now = new Date();
  const diffMs = now - this.createdAt;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
});

// Pre-save middleware - Update readAt timestamp
inquirySchema.pre("save", function (next) {
  if (this.isModified("isRead") && this.isRead && !this.readAt) {
    this.readAt = Date.now();
  }
  next();
});

// Static method - Get seller's inquiries with filters
inquirySchema.statics.getSellerInquiries = async function (
  sellerId,
  options = {}
) {
  const {
    page = 1,
    limit = 10,
    status,
    priority,
    isRead,
    sortBy = "-createdAt",
    propertyId,
  } = options;

  const skip = (page - 1) * limit;
  const query = { seller: sellerId, isActive: true };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (isRead !== undefined) query.isRead = isRead;
  if (propertyId) query.property = propertyId;

  const inquiries = await this.find(query)
    .populate("property", "title type price location images")
    .populate("buyer", "name email phone avatar")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await this.countDocuments(query);

  return {
    inquiries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

// Static method - Get buyer's inquiries
inquirySchema.statics.getBuyerInquiries = async function (
  buyerId,
  options = {}
) {
  const { page = 1, limit = 10, status, sortBy = "-createdAt" } = options;

  const skip = (page - 1) * limit;
  const query = { buyer: buyerId, isActive: true };

  if (status) query.status = status;

  const inquiries = await this.find(query)
    .populate("property", "title type price location images seller")
    .populate("seller", "name email phone")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await this.countDocuments(query);

  return {
    inquiries,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  };
};

// Static method - Get inquiry statistics for seller
inquirySchema.statics.getSellerStats = async function (sellerId) {
  const stats = await this.aggregate([
    {
      $match: {
        seller: mongoose.Types.ObjectId(sellerId),
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
        priorityCount: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
        ],
        unreadCount: [
          {
            $match: { isRead: false },
          },
          {
            $count: "count",
          },
        ],
        avgResponseTime: [
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
              avgTime: { $avg: "$responseTime" },
            },
          },
        ],
        totalInquiries: [
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  return stats[0];
};

// Static method - Mark multiple inquiries as read
inquirySchema.statics.markAsRead = async function (inquiryIds, sellerId) {
  return await this.updateMany(
    {
      _id: { $in: inquiryIds },
      seller: sellerId,
      isRead: false,
    },
    {
      isRead: true,
      readAt: Date.now(),
    }
  );
};

// Static method - Get hot inquiries (high priority, unread, recent)
inquirySchema.statics.getHotInquiries = async function (sellerId) {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return await this.find({
    seller: sellerId,
    isActive: true,
    isRead: false,
    priority: { $in: ["high", "urgent"] },
    createdAt: { $gte: oneDayAgo },
  })
    .populate("property", "title price location")
    .populate("buyer", "name email phone")
    .sort("-priority -createdAt")
    .limit(10);
};

// Instance method - Mark as read
inquirySchema.methods.markAsRead = async function () {
  if (!this.isRead) {
    this.isRead = true;
    this.readAt = Date.now();
    return await this.save();
  }
  return this;
};

// Instance method - Add response
inquirySchema.methods.addResponse = async function (response, responderId) {
  this.response = response;
  this.respondedAt = Date.now();
  this.respondedBy = responderId;
  this.status = "contacted";
  return await this.save();
};

// Instance method - Update status
inquirySchema.methods.updateStatus = async function (status) {
  this.status = status;
  return await this.save();
};

// Instance method - Add note
inquirySchema.methods.addNote = async function (noteText, userId) {
  this.notes.push({
    note: noteText,
    addedBy: userId,
    addedAt: Date.now(),
  });
  return await this.save();
};

// Instance method - Mark as spam
inquirySchema.methods.markAsSpam = async function () {
  this.status = "spam";
  this.isActive = false;
  return await this.save();
};

// Instance method - Add rating and feedback
inquirySchema.methods.addFeedback = async function (rating, feedback) {
  this.rating = rating;
  this.feedback = feedback;
  this.status = "completed";
  return await this.save();
};

const Inquiry = mongoose.model("Inquiry", inquirySchema);

module.exports = Inquiry;
