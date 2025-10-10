const express = require("express");
const router = express.Router();

// Import controllers
const userController = require("../controllers/userController");

// Import middleware
const {
  protect,
  isAdmin,
  isOwnerOrAdmin,
  requireEmailVerification,
} = require("../middlewares/authMiddleware");

// Import validators (when created)
// const {
//   validateUpdateProfile,
//   validateUpdatePreferences,
//   validateDeleteAccount
// } = require('../validators/userValidator');

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", protect, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put("/profile", protect, userController.updateProfile);

/**
 * @route   PUT /api/users/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put("/preferences", protect, userController.updatePreferences);

/**
 * @route   PUT /api/users/avatar
 * @desc    Update user avatar
 * @access  Private
 */
router.put("/avatar", protect, userController.updateAvatar);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account (soft delete)
 * @access  Private
 */
router.delete("/account", protect, userController.deleteAccount);

/**
 * @route   PUT /api/users/role
 * @desc    Update user role (upgrade to 'both')
 * @access  Private
 */
router.put(
  "/role",
  protect,
  requireEmailVerification,
  userController.updateRole
);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get("/stats", protect, userController.getUserStats);

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
router.get("/", protect, isAdmin, userController.getAllUsers);

/**
 * @route   GET /api/users/:userId
 * @desc    Get user by ID (public profile)
 * @access  Public
 */
router.get("/:userId", userController.getUserById);

/**
 * @route   PUT /api/users/:userId/block
 * @desc    Block user (Admin only)
 * @access  Private/Admin
 */
router.put("/:userId/block", protect, isAdmin, userController.blockUser);

/**
 * @route   PUT /api/users/:userId/unblock
 * @desc    Unblock user (Admin only)
 * @access  Private/Admin
 */
router.put("/:userId/unblock", protect, isAdmin, userController.unblockUser);

module.exports = router;
