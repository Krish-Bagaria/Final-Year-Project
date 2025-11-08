const express = require("express");
const router = express.Router();

// Import controllers
const favoriteController = require("../controllers/favoriteController");

// Import middleware
const {
  protect,
  requireEmailVerification,
} = require("../middlewares/authMiddleware");
const { canBuyProperty } = require("../middlewares/roleMiddleware");

// Import validators (when created)
// const {
//   validateAddFavorite,
//   validateUpdateNotes,
//   validateSetReminder
// } = require('../validators/favoriteValidator');

/**
 * All routes require authentication and buyer role
 * Apply protect and canBuyProperty middleware to all routes
 */
router.use(protect);
router.use(canBuyProperty);

/**
 * @route   GET /api/favorites
 * @desc    Get user's favorite properties
 * @access  Private (Buyer)
 */
router.get("/", favoriteController.getFavorites);

/**
 * @route   GET /api/favorites/stats
 * @desc    Get favorite statistics
 * @access  Private (Buyer)
 */
router.get("/stats", favoriteController.getFavoriteStats);

/**
 * @route   GET /api/favorites/by-type
 * @desc    Get favorites grouped by property type
 * @access  Private (Buyer)
 */
router.get("/by-type", favoriteController.getFavoritesByType);

/**
 * @route   GET /api/favorites/check/:propertyId
 * @desc    Check if property is favorited
 * @access  Private (Buyer)
 */
router.get("/check/:propertyId", favoriteController.checkFavorite);

/**
 * @route   POST /api/favorites/:propertyId
 * @desc    Add property to favorites
 * @access  Private (Buyer)
 */
router.post("/:propertyId", favoriteController.addToFavorites);

/**
 * @route   DELETE /api/favorites/:propertyId
 * @desc    Remove property from favorites
 * @access  Private (Buyer)
 */
router.delete("/:propertyId", favoriteController.removeFromFavorites);

/**
 * @route   PUT /api/favorites/:propertyId/toggle
 * @desc    Toggle interested status
 * @access  Private (Buyer)
 */
router.put("/:propertyId/toggle", favoriteController.toggleInterested);

/**
 * @route   PUT /api/favorites/:propertyId/notes
 * @desc    Add/update notes on favorite
 * @access  Private (Buyer)
 */
router.put("/:propertyId/notes", favoriteController.updateFavoriteNotes);

/**
 * @route   PUT /api/favorites/:propertyId/reminder
 * @desc    Set reminder for favorite property
 * @access  Private (Buyer)
 */
router.put("/:propertyId/reminder", favoriteController.setReminder);

/**
 * @route   PUT /api/favorites/:propertyId/view
 * @desc    Increment view count for favorite
 * @access  Private (Buyer)
 */
router.put("/:propertyId/view", favoriteController.incrementFavoriteView);

module.exports = router;
