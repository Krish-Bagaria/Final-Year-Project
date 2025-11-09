const Inquiry = require("../models/Inquiry");
const Property = require("../models/Property");
const User = require("../models/User");

/**
 * @route   POST /api/inquiries
 * @desc    Create new inquiry (buyer contacts seller)
 * @access  Private (Buyer)
 */
const createInquiry = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const {
      propertyId,
      name,
      email,
      phone,
      message,
      inquiryType,
      preferredContactMethod,
      preferredContactTime,
      visitDate,
      budget,
    } = req.body;

    // Validate property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (!property.isActive || property.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Cannot inquire about inactive property",
      });
    }

    // Cannot inquire about own property
    if (property.seller.toString() === buyerId) {
      return res.status(400).json({
        success: false,
        message: "Cannot inquire about your own property",
      });
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      property: propertyId,
      seller: property.seller,
      buyer: buyerId,
      name,
      email,
      phone,
      message,
      inquiryType: inquiryType || "general",
      preferredContactMethod: preferredContactMethod || "any",
      preferredContactTime: preferredContactTime || "anytime",
      visitDate: visitDate || null,
      budget: budget || null,
      status: "pending",
      priority: "medium",
      isRead: false,
      source: "website",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const populatedInquiry = await Inquiry.findById(inquiry._id)
      .populate("property", "title type price location city images")
      .populate("seller", "name email phone")
      .populate("buyer", "name email phone avatar");

    return res.status(201).json({
      success: true,
      message: "Inquiry sent successfully",
      data: {
        inquiry: populatedInquiry,
      },
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create inquiry",
    });
  }
};

/**
 * @route   GET /api/inquiries/sent
 * @desc    Get buyer's sent inquiries
 * @access  Private (Buyer)
 */
const getSentInquiries = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { page = 1, limit = 10, status, sortBy = "-createdAt" } = req.query;

    const result = await Inquiry.getBuyerInquiries(buyerId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      sortBy,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get sent inquiries error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch sent inquiries",
    });
  }
};

/**
 * @route   GET /api/inquiries/received
 * @desc    Get seller's received inquiries
 * @access  Private (Seller)
 */
const getReceivedInquiries = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      isRead,
      propertyId,
      sortBy = "-createdAt",
    } = req.query;

    const result = await Inquiry.getSellerInquiries(sellerId, {
      page: parseInt(page),
      limit: parseInt(limit),
      status,
      priority,
      isRead: isRead !== undefined ? isRead === "true" : undefined,
      propertyId,
      sortBy,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get received inquiries error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch received inquiries",
    });
  }
};

/**
 * @route   GET /api/inquiries/:id
 * @desc    Get inquiry by ID
 * @access  Private (Buyer/Seller - own inquiry only)
 */
const getInquiryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id)
      .populate("property", "title type price location city images seller")
      .populate("seller", "name email phone avatar")
      .populate("buyer", "name email phone avatar");

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Check if user is buyer or seller
    if (
      inquiry.buyer._id.toString() !== userId &&
      inquiry.seller._id.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Mark as read if seller is viewing
    if (inquiry.seller._id.toString() === userId && !inquiry.isRead) {
      await inquiry.markAsRead();
    }

    return res.status(200).json({
      success: true,
      data: {
        inquiry,
      },
    });
  } catch (error) {
    console.error("Get inquiry error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch inquiry",
    });
  }
};

/**
 * @route   PUT /api/inquiries/:id/status
 * @desc    Update inquiry status
 * @access  Private (Seller only)
 */
const updateInquiryStatus = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Verify seller ownership
    if (inquiry.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own property inquiries",
      });
    }

    await inquiry.updateStatus(status);

    return res.status(200).json({
      success: true,
      message: "Inquiry status updated successfully",
      data: {
        inquiry,
      },
    });
  } catch (error) {
    console.error("Update inquiry status error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update inquiry status",
    });
  }
};

/**
 * @route   POST /api/inquiries/:id/respond
 * @desc    Respond to inquiry
 * @access  Private (Seller only)
 */
const respondToInquiry = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: "Response message is required",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Verify seller ownership
    if (inquiry.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "You can only respond to your own property inquiries",
      });
    }

    await inquiry.addResponse(response, sellerId);

    return res.status(200).json({
      success: true,
      message: "Response sent successfully",
      data: {
        inquiry,
      },
    });
  } catch (error) {
    console.error("Respond to inquiry error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to send response",
    });
  }
};

/**
 * @route   POST /api/inquiries/:id/notes
 * @desc    Add note to inquiry (seller only)
 * @access  Private (Seller only)
 */
const addInquiryNote = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: "Note text is required",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Verify seller ownership
    if (inquiry.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await inquiry.addNote(note, sellerId);

    return res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: {
        inquiry,
      },
    });
  } catch (error) {
    console.error("Add inquiry note error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to add note",
    });
  }
};

/**
 * @route   PUT /api/inquiries/:id/read
 * @desc    Mark inquiry as read
 * @access  Private (Seller only)
 */
const markAsRead = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Verify seller ownership
    if (inquiry.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await inquiry.markAsRead();

    return res.status(200).json({
      success: true,
      message: "Inquiry marked as read",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to mark as read",
    });
  }
};

/**
 * @route   PUT /api/inquiries/mark-multiple-read
 * @desc    Mark multiple inquiries as read
 * @access  Private (Seller only)
 */
const markMultipleAsRead = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { inquiryIds } = req.body;

    if (!inquiryIds || !Array.isArray(inquiryIds)) {
      return res.status(400).json({
        success: false,
        message: "Inquiry IDs array is required",
      });
    }

    const result = await Inquiry.markAsRead(inquiryIds, sellerId);

    return res.status(200).json({
      success: true,
      message: "Inquiries marked as read",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Mark multiple as read error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to mark inquiries as read",
    });
  }
};

/**
 * @route   DELETE /api/inquiries/:id
 * @desc    Delete inquiry (soft delete)
 * @access  Private (Buyer/Seller - own inquiry only)
 */
const deleteInquiry = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Check if user is buyer or seller
    if (
      inquiry.buyer.toString() !== userId &&
      inquiry.seller.toString() !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    inquiry.isActive = false;
    await inquiry.save();

    return res.status(200).json({
      success: true,
      message: "Inquiry deleted successfully",
    });
  } catch (error) {
    console.error("Delete inquiry error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete inquiry",
    });
  }
};

/**
 * @route   POST /api/inquiries/:id/spam
 * @desc    Mark inquiry as spam
 * @access  Private (Seller only)
 */
const markAsSpam = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Verify seller ownership
    if (inquiry.seller.toString() !== sellerId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    await inquiry.markAsSpam();

    return res.status(200).json({
      success: true,
      message: "Inquiry marked as spam",
    });
  } catch (error) {
    console.error("Mark as spam error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to mark as spam",
    });
  }
};

/**
 * @route   GET /api/inquiries/stats
 * @desc    Get seller's inquiry statistics
 * @access  Private (Seller only)
 */
const getInquiryStats = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const stats = await Inquiry.getSellerStats(sellerId);

    return res.status(200).json({
      success: true,
      data: {
        stats,
      },
    });
  } catch (error) {
    console.error("Get inquiry stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch inquiry statistics",
    });
  }
};

/**
 * @route   GET /api/inquiries/hot
 * @desc    Get hot inquiries (high priority, unread, recent)
 * @access  Private (Seller only)
 */
const getHotInquiries = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const inquiries = await Inquiry.getHotInquiries(sellerId);

    return res.status(200).json({
      success: true,
      data: {
        inquiries,
        count: inquiries.length,
      },
    });
  } catch (error) {
    console.error("Get hot inquiries error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch hot inquiries",
    });
  }
};

/**
 * @route   POST /api/inquiries/:id/feedback
 * @desc    Add feedback/rating for inquiry experience (buyer)
 * @access  Private (Buyer only)
 */
const addFeedback = async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { id } = req.params;
    const { rating, feedback } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    const inquiry = await Inquiry.findById(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Verify buyer ownership
    if (inquiry.buyer.toString() !== buyerId) {
      return res.status(403).json({
        success: false,
        message: "You can only rate your own inquiries",
      });
    }

    await inquiry.addFeedback(rating, feedback);

    return res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
      data: {
        inquiry,
      },
    });
  } catch (error) {
    console.error("Add feedback error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to submit feedback",
    });
  }
};

module.exports = {
  createInquiry,
  getSentInquiries,
  getReceivedInquiries,
  getInquiryById,
  updateInquiryStatus,
  respondToInquiry,
  addInquiryNote,
  markAsRead,
  markMultipleAsRead,
  deleteInquiry,
  markAsSpam,
  getInquiryStats,
  getHotInquiries,
  addFeedback,
};
