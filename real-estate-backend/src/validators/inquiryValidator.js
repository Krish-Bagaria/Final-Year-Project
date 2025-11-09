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
 * Create inquiry validation
 */
const validateCreateInquiry = [
  body("propertyId")
    .notEmpty()
    .withMessage("Property ID is required")
    .isMongoId()
    .withMessage("Invalid property ID format"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage(
      "Please provide a valid 10-digit Indian phone number starting with 6-9"
    ),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Message must be between 10 and 1000 characters"),

  body("inquiryType")
    .optional()
    .isIn(["general", "visit", "price_negotiation", "documentation", "other"])
    .withMessage("Invalid inquiry type"),

  body("preferredContactMethod")
    .optional()
    .isIn(["email", "phone", "whatsapp", "any"])
    .withMessage("Invalid contact method"),

  body("preferredContactTime")
    .optional()
    .isIn(["morning", "afternoon", "evening", "anytime"])
    .withMessage("Invalid contact time preference"),

  body("visitDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid visit date format")
    .custom((value) => {
      const visitDate = new Date(value);
      const now = new Date();
      if (visitDate < now) {
        throw new Error("Visit date cannot be in the past");
      }
      return true;
    }),

  body("budget.min")
    .optional()
    .isNumeric()
    .withMessage("Minimum budget must be a number")
    .custom((value) => value >= 0)
    .withMessage("Minimum budget cannot be negative"),

  body("budget.max")
    .optional()
    .isNumeric()
    .withMessage("Maximum budget must be a number")
    .custom((value, { req }) => {
      if (req.body.budget?.min && value < req.body.budget.min) {
        throw new Error("Maximum budget must be greater than minimum budget");
      }
      return true;
    }),

  handleValidationErrors,
];

/**
 * Respond to inquiry validation
 */
const validateRespondToInquiry = [
  param("id")
    .notEmpty()
    .withMessage("Inquiry ID is required")
    .isMongoId()
    .withMessage("Invalid inquiry ID format"),

  body("response")
    .trim()
    .notEmpty()
    .withMessage("Response message is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Response must be between 10 and 1000 characters"),

  handleValidationErrors,
];

/**
 * Update inquiry status validation
 */
const validateUpdateStatus = [
  param("id")
    .notEmpty()
    .withMessage("Inquiry ID is required")
    .isMongoId()
    .withMessage("Invalid inquiry ID format"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "pending",
      "contacted",
      "in_progress",
      "completed",
      "cancelled",
      "spam",
    ])
    .withMessage(
      "Invalid status. Must be: pending, contacted, in_progress, completed, cancelled, or spam"
    ),

  handleValidationErrors,
];

/**
 * Add inquiry note validation
 */
const validateAddNote = [
  param("id")
    .notEmpty()
    .withMessage("Inquiry ID is required")
    .isMongoId()
    .withMessage("Invalid inquiry ID format"),

  body("note")
    .trim()
    .notEmpty()
    .withMessage("Note text is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Note must be between 5 and 500 characters"),

  handleValidationErrors,
];

/**
 * Add feedback validation
 */
const validateAddFeedback = [
  param("id")
    .notEmpty()
    .withMessage("Inquiry ID is required")
    .isMongoId()
    .withMessage("Invalid inquiry ID format"),

  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("feedback")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Feedback cannot exceed 500 characters"),

  handleValidationErrors,
];

/**
 * Get inquiry by ID validation
 */
const validateGetInquiryById = [
  param("id")
    .notEmpty()
    .withMessage("Inquiry ID is required")
    .isMongoId()
    .withMessage("Invalid inquiry ID format"),

  handleValidationErrors,
];

/**
 * Get inquiries query validation
 */
const validateGetInquiries = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn([
      "pending",
      "contacted",
      "in_progress",
      "completed",
      "cancelled",
      "spam",
    ])
    .withMessage("Invalid status"),

  query("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),

  query("isRead")
    .optional()
    .isBoolean()
    .withMessage("isRead must be a boolean"),

  query("propertyId")
    .optional()
    .isMongoId()
    .withMessage("Invalid property ID format"),

  query("sortBy")
    .optional()
    .isIn([
      "createdAt",
      "-createdAt",
      "updatedAt",
      "-updatedAt",
      "priority",
      "-priority",
    ])
    .withMessage("Invalid sort option"),

  handleValidationErrors,
];

/**
 * Mark multiple as read validation
 */
const validateMarkMultipleAsRead = [
  body("inquiryIds")
    .notEmpty()
    .withMessage("Inquiry IDs array is required")
    .isArray({ min: 1 })
    .withMessage("Inquiry IDs must be a non-empty array"),

  body("inquiryIds.*")
    .isMongoId()
    .withMessage("Each inquiry ID must be a valid MongoDB ObjectId"),

  handleValidationErrors,
];

/**
 * Common inquiry ID validation (reusable)
 */
const inquiryIdValidation = param("id")
  .notEmpty()
  .withMessage("Inquiry ID is required")
  .isMongoId()
  .withMessage("Invalid inquiry ID format");

/**
 * Common message validation (reusable)
 */
const messageValidation = body("message")
  .trim()
  .notEmpty()
  .withMessage("Message is required")
  .isLength({ min: 10, max: 1000 })
  .withMessage("Message must be between 10 and 1000 characters");

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
 * Common email validation (reusable)
 */
const emailValidation = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required")
  .isEmail()
  .withMessage("Please provide a valid email address")
  .normalizeEmail();

/**
 * Sanitize inquiry input
 */
const sanitizeInquiryInput = [
  body("name").trim().escape(),
  body("message").trim().escape(),
  body("response").trim().escape(),
  body("note").trim().escape(),
  body("feedback").trim().escape(),
  handleValidationErrors,
];

module.exports = {
  // Inquiry validation
  validateCreateInquiry,
  validateRespondToInquiry,
  validateUpdateStatus,
  validateAddNote,
  validateAddFeedback,
  validateGetInquiryById,
  validateGetInquiries,
  validateMarkMultipleAsRead,

  // Reusable validations
  inquiryIdValidation,
  messageValidation,
  phoneValidation,
  emailValidation,

  // Utility
  handleValidationErrors,
  sanitizeInquiryInput,
};
