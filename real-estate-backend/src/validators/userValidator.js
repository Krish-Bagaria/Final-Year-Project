const { body, param, query, validationResult } = require("express-validator");

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
 * Update profile validation
 */
const validateUpdateProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("phone")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please provide a valid 10-digit Indian phone number starting with 6-9"
    ),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("address")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters"),

  body("city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("City can only contain letters and spaces"),

  body("state")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("State can only contain letters and spaces"),

  body("pincode")
    .optional()
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("Pincode must be a 6-digit number"),

  body("avatar")
    .optional()
    .trim()
    .isURL()
    .withMessage("Avatar must be a valid URL"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object"),

  handleValidationErrors,
];

/**
 * Update preferences validation
 */
const validateUpdatePreferences = [
  body("preferences")
    .notEmpty()
    .withMessage("Preferences object is required")
    .isObject()
    .withMessage("Preferences must be an object"),

  body("preferences.propertyTypes")
    .optional()
    .isArray()
    .withMessage("Property types must be an array"),

  body("preferences.propertyTypes.*")
    .optional()
    .isIn(["flat", "plot", "villa", "commercial"])
    .withMessage("Invalid property type"),

  body("preferences.budget")
    .optional()
    .isObject()
    .withMessage("Budget must be an object"),

  body("preferences.budget.min")
    .optional()
    .isNumeric()
    .withMessage("Minimum budget must be a number")
    .custom((value) => value >= 0)
    .withMessage("Minimum budget cannot be negative"),

  body("preferences.budget.max")
    .optional()
    .isNumeric()
    .withMessage("Maximum budget must be a number")
    .custom((value, { req }) => {
      if (
        req.body.preferences?.budget?.min &&
        value < req.body.preferences.budget.min
      ) {
        throw new Error("Maximum budget must be greater than minimum budget");
      }
      return true;
    }),

  body("preferences.locations")
    .optional()
    .isArray()
    .withMessage("Locations must be an array"),

  body("preferences.bedrooms")
    .optional()
    .isInt({ min: 0, max: 10 })
    .withMessage("Bedrooms must be between 0 and 10"),

  body("preferences.notifications")
    .optional()
    .isObject()
    .withMessage("Notifications must be an object"),

  body("preferences.notifications.email")
    .optional()
    .isBoolean()
    .withMessage("Email notification preference must be a boolean"),

  body("preferences.notifications.sms")
    .optional()
    .isBoolean()
    .withMessage("SMS notification preference must be a boolean"),

  handleValidationErrors,
];

/**
 * Update avatar validation
 */
const validateUpdateAvatar = [
  body("avatar")
    .notEmpty()
    .withMessage("Avatar URL is required")
    .trim()
    .isURL()
    .withMessage("Avatar must be a valid URL")
    .isLength({ max: 500 })
    .withMessage("Avatar URL cannot exceed 500 characters"),

  handleValidationErrors,
];

/**
 * Delete account validation
 */
const validateDeleteAccount = [
  body("password")
    .notEmpty()
    .withMessage("Password is required to delete account")
    .isLength({ min: 6 })
    .withMessage("Invalid password"),

  body("confirmDelete")
    .notEmpty()
    .withMessage("Confirmation text is required")
    .equals("DELETE MY ACCOUNT")
    .withMessage('Please type "DELETE MY ACCOUNT" to confirm'),

  handleValidationErrors,
];

/**
 * Update role validation
 */
const validateUpdateRole = [
  body("newRole")
    .notEmpty()
    .withMessage("New role is required")
    .isIn(["buyer", "seller", "both"])
    .withMessage("Role must be either buyer, seller, or both"),

  handleValidationErrors,
];

/**
 * Get user by ID validation
 */
const validateGetUserById = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  handleValidationErrors,
];

/**
 * Get all users validation (query params)
 */
const validateGetAllUsers = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("role")
    .optional()
    .isIn(["buyer", "seller", "both", "admin"])
    .withMessage("Invalid role"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),

  query("isEmailVerified")
    .optional()
    .isBoolean()
    .withMessage("isEmailVerified must be a boolean"),

  query("isPhoneVerified")
    .optional()
    .isBoolean()
    .withMessage("isPhoneVerified must be a boolean"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search term must be between 2 and 100 characters"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "-createdAt", "name", "-name", "email", "-email"])
    .withMessage("Invalid sort option"),

  handleValidationErrors,
];

/**
 * Block user validation
 */
const validateBlockUser = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  body("reason")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Block reason must be between 10 and 500 characters"),

  handleValidationErrors,
];

/**
 * Unblock user validation
 */
const validateUnblockUser = [
  param("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID format"),

  handleValidationErrors,
];

/**
 * Common name validation (reusable)
 */
const nameValidation = body("name")
  .trim()
  .notEmpty()
  .withMessage("Name is required")
  .isLength({ min: 2, max: 100 })
  .withMessage("Name must be between 2 and 100 characters")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Name can only contain letters and spaces");

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
 * Common pincode validation (reusable)
 */
const pincodeValidation = body("pincode")
  .trim()
  .matches(/^\d{6}$/)
  .withMessage("Pincode must be a 6-digit number");

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (field = "id") => {
  return param(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isMongoId()
    .withMessage(`Invalid ${field} format`);
};

/**
 * Sanitize user input
 */
const sanitizeUserInput = [body("*").trim().escape(), handleValidationErrors];

module.exports = {
  // Profile validation
  validateUpdateProfile,
  validateUpdatePreferences,
  validateUpdateAvatar,
  validateDeleteAccount,
  validateUpdateRole,

  // User management validation
  validateGetUserById,
  validateGetAllUsers,
  validateBlockUser,
  validateUnblockUser,

  // Reusable validations
  nameValidation,
  phoneValidation,
  pincodeValidation,
  validateObjectId,

  // Utility
  handleValidationErrors,
  sanitizeUserInput,
};
