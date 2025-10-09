const express = require("express");
const router = express.Router();

// Import controllers
const authController = require("../controllers/authController");

// Import middleware
const { protect } = require("../middlewares/authMiddleware");

// Import validators (if you create them later)
// const { validateRegister, validateLogin, validatePasswordReset } = require('../validators/authValidator');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", authController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", protect, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get("/me", protect, authController.getCurrentUser);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get("/verify-email/:token", authController.verifyEmail);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification link
 * @access  Public
 */
router.post("/resend-verification", authController.resendVerification);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset link
 * @access  Public
 */
router.post("/forgot-password", authController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
router.post("/reset-password/:token", authController.resetPassword);

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password (authenticated user)
 * @access  Private
 */
router.put("/change-password", protect, authController.changePassword);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @route   POST /api/auth/check-email
 * @desc    Check if email is available
 * @access  Public
 */
router.post("/check-email", authController.checkEmail);

/**
 * @route   POST /api/auth/check-phone
 * @desc    Check if phone number is available
 * @access  Public
 */
router.post("/check-phone", authController.checkPhone);

/**
 * @route   POST /api/auth/send-phone-otp
 * @desc    Send OTP to phone number
 * @access  Private
 */
router.post("/send-phone-otp", protect, authController.sendPhoneOTP);

/**
 * @route   POST /api/auth/verify-phone
 * @desc    Verify phone number with OTP
 * @access  Private
 */
router.post("/verify-phone", protect, authController.verifyPhone);

module.exports = router;
