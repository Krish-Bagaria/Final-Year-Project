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
 * Create property validation
 */
const validateCreateProperty = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Property title is required")
    .isLength({ min: 10, max: 200 })
    .withMessage("Title must be between 10 and 200 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Property description is required")
    .isLength({ min: 50, max: 2000 })
    .withMessage("Description must be between 50 and 2000 characters"),

  body("type")
    .notEmpty()
    .withMessage("Property type is required")
    .isIn(["flat", "plot", "villa", "commercial"])
    .withMessage("Property type must be flat, plot, villa, or commercial"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value >= 100000)
    .withMessage("Price must be at least ₹1,00,000"),

  body("area")
    .notEmpty()
    .withMessage("Area is required")
    .isNumeric()
    .withMessage("Area must be a number")
    .custom((value) => value >= 100)
    .withMessage("Area must be at least 100 sq.ft"),

  body("bedrooms")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Bedrooms must be between 0 and 20"),

  body("bathrooms")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Bathrooms must be between 0 and 20"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Location must be between 3 and 100 characters"),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 10, max: 300 })
    .withMessage("Address must be between 10 and 300 characters"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required")
    .matches(/^\d{6}$/)
    .withMessage("Pincode must be a 6-digit number"),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array"),

  body("amenities.*")
    .optional()
    .isString()
    .withMessage("Each amenity must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Amenity must be between 2 and 50 characters"),

  body("images").optional().isArray().withMessage("Images must be an array"),

  body("images.*.url")
    .optional()
    .isURL()
    .withMessage("Image URL must be valid"),

  body("images.*.publicId")
    .optional()
    .isString()
    .withMessage("Image publicId must be a string"),

  body("documents")
    .optional()
    .isArray()
    .withMessage("Documents must be an array"),

  body("features")
    .optional()
    .isObject()
    .withMessage("Features must be an object"),

  body("features.facing")
    .optional()
    .isIn([
      "north",
      "south",
      "east",
      "west",
      "north-east",
      "north-west",
      "south-east",
      "south-west",
    ])
    .withMessage("Invalid facing direction"),

  body("features.floor")
    .optional()
    .isInt({ min: 0, max: 200 })
    .withMessage("Floor must be between 0 and 200"),

  body("features.totalFloors")
    .optional()
    .isInt({ min: 1, max: 200 })
    .withMessage("Total floors must be between 1 and 200")
    .custom((value, { req }) => {
      if (req.body.features?.floor && value < req.body.features.floor) {
        throw new Error(
          "Total floors must be greater than or equal to current floor"
        );
      }
      return true;
    }),

  body("features.furnishing")
    .optional()
    .isIn(["furnished", "semi-furnished", "unfurnished"])
    .withMessage(
      "Furnishing must be furnished, semi-furnished, or unfurnished"
    ),

  body("features.parking")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Parking spaces must be between 0 and 20"),

  body("features.age")
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage("Property age must be between 0 and 100 years"),

  body("nearbyPlaces")
    .optional()
    .isArray()
    .withMessage("Nearby places must be an array"),

  body("nearbyPlaces.*.name")
    .optional()
    .isString()
    .withMessage("Nearby place name must be a string"),

  body("nearbyPlaces.*.distance")
    .optional()
    .isNumeric()
    .withMessage("Distance must be a number"),

  handleValidationErrors,
];

/**
 * Update property validation
 */
const validateUpdateProperty = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Title must be between 10 and 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage("Description must be between 50 and 2000 characters"),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .custom((value) => value >= 100000)
    .withMessage("Price must be at least ₹1,00,000"),

  body("area")
    .optional()
    .isNumeric()
    .withMessage("Area must be a number")
    .custom((value) => value >= 100)
    .withMessage("Area must be at least 100 sq.ft"),

  body("bedrooms")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Bedrooms must be between 0 and 20"),

  body("bathrooms")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Bathrooms must be between 0 and 20"),

  body("location")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Location must be between 3 and 100 characters"),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage("Address must be between 10 and 300 characters"),

  body("city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  body("state")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("State must be between 2 and 50 characters"),

  body("pincode")
    .optional()
    .trim()
    .matches(/^\d{6}$/)
    .withMessage("Pincode must be a 6-digit number"),

  body("amenities")
    .optional()
    .isArray()
    .withMessage("Amenities must be an array"),

  body("images").optional().isArray().withMessage("Images must be an array"),

  body("status")
    .optional()
    .isIn(["active", "sold", "rented", "inactive"])
    .withMessage("Status must be active, sold, rented, or inactive"),

  handleValidationErrors,
];

/**
 * Update property status validation
 */
const validatePropertyStatus = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["active", "sold", "rented", "inactive"])
    .withMessage("Status must be active, sold, rented, or inactive"),

  handleValidationErrors,
];

/**
 * Get property by ID validation
 */
const validateGetPropertyById = [
  param("id")
    .notEmpty()
    .withMessage("Property ID is required")
    .isMongoId()
    .withMessage("Invalid property ID format"),

  handleValidationErrors,
];

/**
 * Get all properties validation (query params)
 */
const validateGetAllProperties = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("type")
    .optional()
    .isIn(["flat", "plot", "villa", "commercial"])
    .withMessage("Invalid property type"),

  query("minPrice")
    .optional()
    .isNumeric()
    .withMessage("Minimum price must be a number"),

  query("maxPrice")
    .optional()
    .isNumeric()
    .withMessage("Maximum price must be a number")
    .custom((value, { req }) => {
      if (
        req.query.minPrice &&
        parseInt(value) < parseInt(req.query.minPrice)
      ) {
        throw new Error("Maximum price must be greater than minimum price");
      }
      return true;
    }),

  query("bedrooms")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Bedrooms must be between 0 and 20"),

  query("city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  query("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),

  query("status")
    .optional()
    .isIn(["active", "sold", "rented", "inactive"])
    .withMessage("Invalid status"),

  query("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be a boolean"),

  query("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search term must be between 2 and 100 characters"),

  query("sortBy")
    .optional()
    .isIn([
      "createdAt",
      "-createdAt",
      "price",
      "-price",
      "viewCount",
      "-viewCount",
    ])
    .withMessage("Invalid sort option"),

  handleValidationErrors,
];

/**
 * Search properties validation
 */
const validateSearchProperties = [
  query("q")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Search query must be between 2 and 100 characters"),

  query("type")
    .optional()
    .isIn(["flat", "plot", "villa", "commercial"])
    .withMessage("Invalid property type"),

  query("minPrice")
    .optional()
    .isNumeric()
    .withMessage("Minimum price must be a number"),

  query("maxPrice")
    .optional()
    .isNumeric()
    .withMessage("Maximum price must be a number"),

  query("minBedrooms")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Minimum bedrooms must be between 0 and 20"),

  query("maxBedrooms")
    .optional()
    .isInt({ min: 0, max: 20 })
    .withMessage("Maximum bedrooms must be between 0 and 20")
    .custom((value, { req }) => {
      if (
        req.query.minBedrooms &&
        parseInt(value) < parseInt(req.query.minBedrooms)
      ) {
        throw new Error(
          "Maximum bedrooms must be greater than minimum bedrooms"
        );
      }
      return true;
    }),

  query("city")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("City must be between 2 and 50 characters"),

  query("location")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Location must be between 2 and 100 characters"),

  query("amenities")
    .optional()
    .isString()
    .withMessage("Amenities must be a comma-separated string"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn(["relevance", "price_asc", "price_desc", "newest", "popular"])
    .withMessage("Invalid sort option"),

  handleValidationErrors,
];

/**
 * Get seller properties validation
 */
const validateGetSellerProperties = [
  param("sellerId")
    .notEmpty()
    .withMessage("Seller ID is required")
    .isMongoId()
    .withMessage("Invalid seller ID format"),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  handleValidationErrors,
];

/**
 * Common property type validation (reusable)
 */
const propertyTypeValidation = body("type")
  .notEmpty()
  .withMessage("Property type is required")
  .isIn(["flat", "plot", "villa", "commercial"])
  .withMessage("Property type must be flat, plot, villa, or commercial");

/**
 * Common price validation (reusable)
 */
const priceValidation = body("price")
  .notEmpty()
  .withMessage("Price is required")
  .isNumeric()
  .withMessage("Price must be a number")
  .custom((value) => value >= 100000)
  .withMessage("Price must be at least ₹1,00,000");

/**
 * Common pincode validation (reusable)
 */
const pincodeValidation = body("pincode")
  .trim()
  .notEmpty()
  .withMessage("Pincode is required")
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
 * Sanitize property input
 */
const sanitizePropertyInput = [
  body("title").trim().escape(),
  body("description").trim().escape(),
  body("location").trim().escape(),
  body("address").trim().escape(),
  body("city").trim().escape(),
  body("state").trim().escape(),
  handleValidationErrors,
];

module.exports = {
  // Property validation
  validateCreateProperty,
  validateUpdateProperty,
  validatePropertyStatus,
  validateGetPropertyById,
  validateGetAllProperties,
  validateSearchProperties,
  validateGetSellerProperties,

  // Reusable validations
  propertyTypeValidation,
  priceValidation,
  pincodeValidation,
  validateObjectId,

  // Utility
  handleValidationErrors,
  sanitizePropertyInput,
};
