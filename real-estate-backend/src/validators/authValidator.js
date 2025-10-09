const { body, param, validationResult } = require("express-validator");

/**
 * Validation error handler middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
        value: err.value,
      })),
    });
  }

  next();
};

/**
 * Register validation rules
 */
const validateRegister = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail()
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please provide a valid 10-digit Indian phone number starting with 6-9"
    ),

  body("role")
    .optional()
    .isIn(["buyer", "seller", "both"])
    .withMessage("Role must be either buyer, seller, or both"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),

  handleValidationErrors,
];

/**
 * Login validation rules
 */
const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  handleValidationErrors,
];

/**
 * Email verification token validation
 */
const validateVerifyEmail = [
  param("token")
    .notEmpty()
    .withMessage("Verification token is required")
    .isLength({ min: 10 })
    .withMessage("Invalid verification token"),

  handleValidationErrors,
];

/**
 * Resend verification validation
 */
const validateResendVerification = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

/**
 * Forgot password validation
 */
const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

/**
 * Reset password validation
 */
const validateResetPassword = [
  param("token")
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 10 })
    .withMessage("Invalid reset token"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  handleValidationErrors,
];

/**
 * Change password validation
 */
const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isLength({ min: 6 })
    .withMessage("Invalid current password"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("New password must be different from current password");
      }
      return true;
    }),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  handleValidationErrors,
];

/**
 * Refresh token validation
 */
const validateRefreshToken = [
  body("refreshToken")
    .optional()
    .notEmpty()
    .withMessage("Refresh token is required")
    .isLength({ min: 10 })
    .withMessage("Invalid refresh token"),

  handleValidationErrors,
];

/**
 * Check email availability validation
 */
const validateCheckEmail = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  handleValidationErrors,
];

/**
 * Check phone availability validation
 */
const validateCheckPhone = [
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please provide a valid 10-digit Indian phone number starting with 6-9"
    ),

  handleValidationErrors,
];

/**
 * Phone OTP validation
 */
const validatePhoneOTP = [
  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required")
    .matches(/^\d{6}$/)
    .withMessage("OTP must be a 6-digit number"),

  handleValidationErrors,
];

/**
 * Common email validation (reusable)
 */
const emailValidation = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please provide a valid email address")
  .normalizeEmail()
  .isLength({ max: 100 })
  .withMessage("Email cannot exceed 100 characters");

/**
 * Common password validation (reusable)
 */
const passwordValidation = body("password")
  .notEmpty()
  .withMessage("Password is required")
  .isLength({ min: 8, max: 128 })
  .withMessage("Password must be between 8 and 128 characters")
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .withMessage(
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

/**
 * Common phone validation (reusable)
 */
const phoneValidation = body("phone")
  .trim()
  .notEmpty()
  .withMessage("Phone number is required")
  .matches(/^[6-9]\d{9}$/)
  .withMessage(
    "Please provide a valid 10-digit Indian phone number starting with 6-9"
  );

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
const sanitizeInput = [body("*").trim().escape(), handleValidationErrors];

module.exports = {
  // Validation middleware
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateResendVerification,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
  validateRefreshToken,
  validateCheckEmail,
  validateCheckPhone,
  validatePhoneOTP,

  // Reusable validations
  emailValidation,
  passwordValidation,
  phoneValidation,

  // Utility
  handleValidationErrors,
  sanitizeInput,
};
