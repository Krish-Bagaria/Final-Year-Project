const express = require("express");
const router = express.Router();

// Import controllers
const inquiryController = require("../controllers/inquiryController");

// Import middleware
const { protect } = require("../middlewares/authMiddleware");
const {
  canBuyProperty,
  canRespondToInquiry,
} = require("../middlewares/roleMiddleware");

// Import validators (when created)
// const {
//   validateCreateInquiry,
//   validateRespondToInquiry,
//   validateUpdateStatus,
//   validateAddFeedback
// } = require('../validators/inquiryValidator');

/**
 * All routes require authentication
 */
router.use(protect);

/**
 * Buyer Routes
 */

/**
 * @route   POST /api/inquiries
 * @desc    Create new inquiry
 * @access  Private (Buyer)
 */
router.post("/", canBuyProperty, inquiryController.createInquiry);

/**
 * @route   GET /api/inquiries/sent
 * @desc    Get buyer's sent inquiries
 * @access  Private (Buyer)
 */
router.get("/sent", canBuyProperty, inquiryController.getSentInquiries);

/**
 * @route   POST /api/inquiries/:id/feedback
 * @desc    Add feedback/rating for inquiry
 * @access  Private (Buyer)
 */
router.post("/:id/feedback", canBuyProperty, inquiryController.addFeedback);

/**
 * Seller Routes
 */

/**
 * @route   GET /api/inquiries/received
 * @desc    Get seller's received inquiries
 * @access  Private (Seller)
 */
router.get("/received", inquiryController.getReceivedInquiries);

/**
 * @route   GET /api/inquiries/stats
 * @desc    Get seller's inquiry statistics
 * @access  Private (Seller)
 */
router.get("/stats", inquiryController.getInquiryStats);

/**
 * @route   GET /api/inquiries/hot
 * @desc    Get hot inquiries (high priority, unread, recent)
 * @access  Private (Seller)
 */
router.get("/hot", inquiryController.getHotInquiries);

/**
 * @route   POST /api/inquiries/:id/respond
 * @desc    Respond to inquiry
 * @access  Private (Seller - own property inquiry)
 */
router.post(
  "/:id/respond",
  canRespondToInquiry,
  inquiryController.respondToInquiry
);

/**
 * @route   PUT /api/inquiries/:id/status
 * @desc    Update inquiry status
 * @access  Private (Seller - own property inquiry)
 */
router.put("/:id/status", inquiryController.updateInquiryStatus);

/**
 * @route   POST /api/inquiries/:id/notes
 * @desc    Add note to inquiry
 * @access  Private (Seller - own property inquiry)
 */
router.post("/:id/notes", inquiryController.addInquiryNote);

/**
 * @route   PUT /api/inquiries/:id/read
 * @desc    Mark inquiry as read
 * @access  Private (Seller - own property inquiry)
 */
router.put("/:id/read", inquiryController.markAsRead);

/**
 * @route   PUT /api/inquiries/mark-multiple-read
 * @desc    Mark multiple inquiries as read
 * @access  Private (Seller)
 */
router.put("/mark-multiple-read", inquiryController.markMultipleAsRead);

/**
 * @route   POST /api/inquiries/:id/spam
 * @desc    Mark inquiry as spam
 * @access  Private (Seller - own property inquiry)
 */
router.post("/:id/spam", inquiryController.markAsSpam);

/**
 * Shared Routes (Buyer/Seller)
 */

/**
 * @route   GET /api/inquiries/:id
 * @desc    Get inquiry by ID
 * @access  Private (Buyer/Seller - own inquiry only)
 */
router.get("/:id", inquiryController.getInquiryById);

/**
 * @route   DELETE /api/inquiries/:id
 * @desc    Delete inquiry
 * @access  Private (Buyer/Seller - own inquiry only)
 */
router.delete("/:id", inquiryController.deleteInquiry);

module.exports = router;
