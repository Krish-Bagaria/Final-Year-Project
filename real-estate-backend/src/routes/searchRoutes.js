const express = require("express");
const router = express.Router();

// Import controllers
const searchController = require("../controllers/searchController");

// Import middleware
const { protect } = require("../middlewares/authMiddleware");

// Import validators (when created)
// const {
//   validateSearch,
//   validateSaveSearch,
//   validateNearbySearch
// } = require('../validators/searchValidator');

/**
 * Public Routes
 */

/**
 * @route   GET /api/search
 * @desc    Search properties with advanced filters
 * @access  Public
 */
router.get("/", searchController.searchProperties);

/**
 * @route   GET /api/search/suggestions
 * @desc    Get search suggestions/autocomplete
 * @access  Public
 */
router.get("/suggestions", searchController.getSearchSuggestions);

/**
 * @route   GET /api/search/popular
 * @desc    Get popular searches
 * @access  Public
 */
router.get("/popular", searchController.getPopularSearches);

/**
 * @route   GET /api/search/filters
 * @desc    Get available search filters
 * @access  Public
 */
router.get("/filters", searchController.getSearchFilters);

/**
 * @route   GET /api/search/price-ranges
 * @desc    Get price range categories with counts
 * @access  Public
 */
router.get("/price-ranges", searchController.getPriceRangeCategories);

/**
 * @route   GET /api/search/locations
 * @desc    Get property count by location
 * @access  Public
 */
router.get("/locations", searchController.getPropertyCountByLocation);

/**
 * @route   GET /api/search/nearby
 * @desc    Get nearby properties (geospatial search)
 * @access  Public
 */
router.get("/nearby", searchController.getNearbyProperties);

/**
 * Private Routes (Authentication Required)
 */

/**
 * @route   POST /api/search/save
 * @desc    Save user search
 * @access  Private
 */
router.post("/save", protect, searchController.saveSearch);

/**
 * @route   GET /api/search/saved
 * @desc    Get user's saved searches
 * @access  Private
 */
router.get("/saved", protect, searchController.getSavedSearches);

/**
 * @route   DELETE /api/search/saved/:searchId
 * @desc    Delete saved search
 * @access  Private
 */
router.delete("/saved/:searchId", protect, searchController.deleteSavedSearch);

module.exports = router;
