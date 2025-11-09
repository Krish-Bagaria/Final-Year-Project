const express = require("express");
const router = express.Router();

// Import controllers
const dashboardController = require("../controllers/dashboardController");

// Import middleware
const { protect } = require("../middlewares/authMiddleware");
const {
  canBuyProperty,
  canSellProperty,
} = require("../middlewares/roleMiddleware");

/**
 * All routes require authentication
 */
router.use(protect);

/**
 * @route   GET /api/dashboard/buyer
 * @desc    Get buyer dashboard data
 * @access  Private (Buyer)
 */
router.get("/buyer", canBuyProperty, dashboardController.getBuyerDashboard);

/**
 * @route   GET /api/dashboard/seller
 * @desc    Get seller dashboard data
 * @access  Private (Seller)
 */
router.get("/seller", canSellProperty, dashboardController.getSellerDashboard);

/**
 * @route   GET /api/dashboard/analytics
 * @desc    Get detailed analytics
 * @access  Private (Seller)
 */
router.get(
  "/analytics",
  canSellProperty,
  dashboardController.getDetailedAnalytics
);

/**
 * @route   GET /api/dashboard/overview
 * @desc    Get quick overview
 * @access  Private (Both)
 */
router.get("/overview", dashboardController.getQuickOverview);

/**
 * @route   GET /api/dashboard/notifications
 * @desc    Get user notifications
 * @access  Private (Both)
 */
router.get("/notifications", dashboardController.getNotifications);

module.exports = router;
