const { verifyToken, extractTokenFromHeader } = require("../utils/jwt");
const User = require("../models/User");

/**
 * Protect routes - Verify JWT token and authenticate user
 * @middleware
 */
const protect = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || "Invalid or expired token",
      });
    }

    // Find user by ID from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token is invalid.",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Check if user is blocked
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: `Account is blocked. Reason: ${
          user.blockedReason || "Contact support"
        }`,
      });
    }

    // Check if password was changed after token was issued
    if (user.passwordChangedAt) {
      const passwordChangedTimestamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );

      if (decoded.iat < passwordChangedTimestamp) {
        return res.status(401).json({
          success: false,
          message: "Password was recently changed. Please login again.",
        });
      }
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * Optional authentication - Attach user if token exists, but don't fail if not
 * @middleware
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // No token, continue without user
      req.user = null;
      return next();
    }

    // Try to verify token
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      // Invalid token, continue without user
      req.user = null;
      return next();
    }

    // Find user
    const user = await User.findById(decoded.id).select("-password");

    if (user && user.isActive && !user.isBlocked) {
      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    req.user = null;
    next();
  }
};

/**
 * Restrict to specific roles
 * @param {...String} roles - Allowed roles
 * @middleware
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. This route is restricted to: ${roles.join(
            ", "
          )}`,
        });
      }

      next();
    } catch (error) {
      console.error("Role restriction error:", error);
      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};

/**
 * Check if user is buyer
 * @middleware
 */
const isBuyer = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "buyer" && req.user.role !== "both") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Buyers only.",
    });
  }

  next();
};

/**
 * Check if user is seller
 * @middleware
 */
const isSeller = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "seller" && req.user.role !== "both") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Sellers only.",
    });
  }

  next();
};

/**
 * Check if user is admin
 * @middleware
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admins only.",
    });
  }

  next();
};

/**
 * Check if user is the resource owner or admin
 * @param {String} resourceUserField - Field name containing user ID in resource
 * @middleware
 */
const isOwnerOrAdmin = (resourceUserField = "user") => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      // Admin can access everything
      if (req.user.role === "admin") {
        return next();
      }

      // Check if user owns the resource
      const resourceUserId =
        req.params.userId ||
        req.body[resourceUserField] ||
        req[resourceUserField];

      if (!resourceUserId) {
        return res.status(400).json({
          success: false,
          message: "Resource user ID not found",
        });
      }

      if (req.user._id.toString() !== resourceUserId.toString()) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only access your own resources.",
        });
      }

      next();
    } catch (error) {
      console.error("Owner check error:", error);
      return res.status(500).json({
        success: false,
        message: "Authorization failed",
      });
    }
  };
};

/**
 * Check if email is verified
 * @middleware
 */
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message:
        "Email verification required. Please verify your email to continue.",
    });
  }

  next();
};

/**
 * Check if phone is verified
 * @middleware
 */
const requirePhoneVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.user.isPhoneVerified) {
    return res.status(403).json({
      success: false,
      message:
        "Phone verification required. Please verify your phone to continue.",
    });
  }

  next();
};

/**
 * Check if profile is complete
 * @middleware
 */
const requireCompleteProfile = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const requiredFields = ["name", "email", "phone"];
  const missingFields = requiredFields.filter((field) => !req.user[field]);

  if (missingFields.length > 0) {
    return res.status(403).json({
      success: false,
      message: `Please complete your profile. Missing: ${missingFields.join(
        ", "
      )}`,
    });
  }

  next();
};

/**
 * Rate limit by user ID (for authenticated routes)
 * @param {Number} maxRequests - Maximum requests allowed
 * @param {Number} windowMs - Time window in milliseconds
 * @middleware
 */
const userRateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const userRequests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();

    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }

    const requests = userRequests.get(userId);

    // Remove old requests outside time window
    const validRequests = requests.filter((time) => now - time < windowMs);

    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    validRequests.push(now);
    userRequests.set(userId, validRequests);

    next();
  };
};

/**
 * Check multiple permissions (AND logic)
 * @param {...Function} middlewares - Middleware functions to check
 * @middleware
 */
const requireAll = (...middlewares) => {
  return async (req, res, next) => {
    for (const middleware of middlewares) {
      try {
        await new Promise((resolve, reject) => {
          middleware(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } catch (error) {
        return; // Middleware already sent response
      }
    }
    next();
  };
};

/**
 * Attach user ID from params to request
 * @middleware
 */
const attachUserId = (req, res, next) => {
  if (req.params.userId) {
    req.targetUserId = req.params.userId;
  }
  next();
};

module.exports = {
  // Core authentication
  protect,
  optionalAuth,

  // Role-based access control
  restrictTo,
  isBuyer,
  isSeller,
  isAdmin,
  isOwnerOrAdmin,

  // Verification requirements
  requireEmailVerification,
  requirePhoneVerification,
  requireCompleteProfile,

  // Additional security
  userRateLimit,
  requireAll,
  attachUserId,
};
