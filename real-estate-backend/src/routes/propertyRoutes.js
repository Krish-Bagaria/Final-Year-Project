const express = require("express");
const router = express.Router();

// Import controllers
const propertyController = require("../controllers/propertyController");

// Import middleware
const {
  protect,
  optionalAuth,
  isAdmin,
  canManageProperty,
} = require("../middlewares/authMiddleware");

const { canSellProperty } = require("../middlewares/roleMiddleware");

// Import validators (when created)
// const {
//   validateCreateProperty,
//   validateUpdateProperty,
//   validatePropertyStatus
// } = require('../validators/propertyValidator');

/**
 * Public Routes (No Authentication Required)
 */

/**
 * @route   GET /api/properties
 * @desc    Get all properties with filters
 * @access  Public
 */
router.get("/", propertyController.getAllProperties);

/**
 * @route   GET /api/properties/featured
 * @desc    Get featured properties
 * @access  Public
 */
router.get("/featured", propertyController.getFeaturedProperties);

/**
 * @route   GET /api/properties/trending
 * @desc    Get trending properties (most viewed)
 * @access  Public
 */
router.get("/trending", propertyController.getTrendingProperties);

/**
 * @route   GET /api/properties/search
 * @desc    Search properties with advanced filters
 * @access  Public
 */
router.get("/search", propertyController.searchProperties);

/**
 * @route   GET /api/properties/seller/:sellerId
 * @desc    Get properties by seller ID (public profile)
 * @access  Public
 */
router.get("/seller/:sellerId", propertyController.getPropertiesBySeller);

/**
 * @route   GET /api/properties/:id
 * @desc    Get property by ID
 * @access  Public (increments view count)
 */
router.get("/:id", propertyController.getPropertyById);

/**
 * @route   GET /api/properties/:id/similar
 * @desc    Get similar properties
 * @access  Public
 */
router.get("/:id/similar", propertyController.getSimilarProperties);

/**
 * Private Routes - Seller Only
 */

/**
 * @route   POST /api/properties
 * @desc    Create new property
 * @access  Private (Seller/Both only)
 */
router.post("/", protect, canSellProperty, propertyController.createProperty);

/**
 * @route   GET /api/properties/my-listings
 * @desc    Get current seller's properties
 * @access  Private (Seller/Both only)
 */
router.get(
  "/my-listings",
  protect,
  canSellProperty,
  propertyController.getMyListings
);

/**
 * @route   GET /api/properties/stats/seller
 * @desc    Get seller's property statistics
 * @access  Private (Seller/Both only)
 */
router.get(
  "/stats/seller",
  protect,
  canSellProperty,
  propertyController.getSellerStats
);

/**
 * @route   PUT /api/properties/:id
 * @desc    Update property
 * @access  Private (Owner or Admin)
 */
router.put(
  "/:id",
  protect,
  canManageProperty,
  propertyController.updateProperty
);

/**
 * @route   DELETE /api/properties/:id
 * @desc    Delete property (soft delete)
 * @access  Private (Owner or Admin)
 */
router.delete(
  "/:id",
  protect,
  canManageProperty,
  propertyController.deleteProperty
);

/**
 * @route   PATCH /api/properties/:id/status
 * @desc    Update property status
 * @access  Private (Owner or Admin)
 */
router.patch(
  "/:id/status",
  protect,
  canManageProperty,
  propertyController.updatePropertyStatus
);

/**
 * Admin Routes
 */

/**
 * @route   PATCH /api/properties/:id/featured
 * @desc    Mark property as featured
 * @access  Private (Admin only)
 */
router.patch(
  "/:id/featured",
  protect,
  isAdmin,
  propertyController.markAsFeatured
);

/**
 * @route   PATCH /api/properties/:id/unfeatured
 * @desc    Remove property from featured
 * @access  Private (Admin only)
 */
router.patch(
  "/:id/unfeatured",
  protect,
  isAdmin,
  propertyController.removeFromFeatured
);

/**
 * @route   PATCH /api/properties/:id/verify
 * @desc    Verify property
 * @access  Private (Admin only)
 */
router.patch(
  "/:id/verify",
  protect,
  isAdmin,
  propertyController.verifyProperty
);

module.exports = router;
