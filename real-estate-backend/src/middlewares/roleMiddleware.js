/**
 * Role-based Access Control (RBAC) Middleware
 * Advanced role and permission management for Jaipur Real Estate
 */

// Role hierarchy (higher number = more permissions)
const ROLE_HIERARCHY = {
  admin: 4,
  both: 3,
  seller: 2,
  buyer: 1,
};

// Role permissions mapping
const ROLE_PERMISSIONS = {
  admin: [
    "user:read",
    "user:write",
    "user:delete",
    "property:read",
    "property:write",
    "property:delete",
    "property:approve",
    "inquiry:read",
    "inquiry:write",
    "inquiry:delete",
    "testimonial:read",
    "testimonial:write",
    "testimonial:delete",
    "testimonial:approve",
    "analytics:read",
    "analytics:write",
    "settings:read",
    "settings:write",
  ],
  seller: [
    "property:read",
    "property:write",
    "property:own",
    "inquiry:read",
    "inquiry:respond",
    "analytics:own",
    "testimonial:read",
  ],
  buyer: [
    "property:read",
    "inquiry:write",
    "favorite:read",
    "favorite:write",
    "testimonial:write",
    "search:use",
  ],
  both: [
    "property:read",
    "property:write",
    "property:own",
    "inquiry:read",
    "inquiry:write",
    "inquiry:respond",
    "favorite:read",
    "favorite:write",
    "analytics:own",
    "testimonial:read",
    "testimonial:write",
    "search:use",
  ],
};

/**
 * Check if user has required permission
 * @param {String} permission - Required permission (e.g., 'property:write')
 * @middleware
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRole = req.user.role;
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];

      if (!userPermissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: `Permission denied. Required permission: ${permission}`,
          userRole: userRole,
          requiredPermission: permission,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

/**
 * Check if user has any of the required permissions (OR logic)
 * @param {...String} permissions - List of permissions
 * @middleware
 */
const checkAnyPermission = (...permissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRole = req.user.role;
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];

      const hasAnyPermission = permissions.some((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          message: `Permission denied. Required one of: ${permissions.join(
            ", "
          )}`,
          userRole: userRole,
          requiredPermissions: permissions,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

/**
 * Check if user has all required permissions (AND logic)
 * @param {...String} permissions - List of permissions
 * @middleware
 */
const checkAllPermissions = (...permissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRole = req.user.role;
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];

      const hasAllPermissions = permissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        const missingPermissions = permissions.filter(
          (p) => !userPermissions.includes(p)
        );

        return res.status(403).json({
          success: false,
          message: `Permission denied. Missing: ${missingPermissions.join(
            ", "
          )}`,
          userRole: userRole,
          missingPermissions: missingPermissions,
        });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      return res.status(500).json({
        success: false,
        message: "Permission check failed",
      });
    }
  };
};

/**
 * Check if user role is higher or equal in hierarchy
 * @param {String} requiredRole - Minimum required role
 * @middleware
 */
const checkRoleHierarchy = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const userRoleLevel = ROLE_HIERARCHY[req.user.role] || 0;
      const requiredRoleLevel = ROLE_HIERARCHY[requiredRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Minimum role required: ${requiredRole}`,
          currentRole: req.user.role,
          requiredRole: requiredRole,
        });
      }

      next();
    } catch (error) {
      console.error("Role hierarchy check error:", error);
      return res.status(500).json({
        success: false,
        message: "Role check failed",
      });
    }
  };
};

/**
 * Check if user can perform action on resource
 * @param {String} action - Action to perform (read, write, delete)
 * @param {String} resource - Resource type (property, inquiry, etc.)
 * @middleware
 */
const canAccess = (action, resource) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const permission = `${resource}:${action}`;
      const userRole = req.user.role;
      const userPermissions = ROLE_PERMISSIONS[userRole] || [];

      if (!userPermissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: `Cannot ${action} ${resource}. Permission denied.`,
          userRole: userRole,
          requiredPermission: permission,
        });
      }

      next();
    } catch (error) {
      console.error("Access check error:", error);
      return res.status(500).json({
        success: false,
        message: "Access check failed",
      });
    }
  };
};

/**
 * Check if user is buyer or has buyer capabilities
 * @middleware
 */
const canBuyProperty = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role === "buyer" || req.user.role === "both") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message:
      "Only buyers can perform this action. Switch to buyer role or create a buyer account.",
    currentRole: req.user.role,
  });
};

/**
 * Check if user is seller or has seller capabilities
 * @middleware
 */
const canSellProperty = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (req.user.role === "seller" || req.user.role === "both") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Only sellers can perform this action. Upgrade to seller role.",
    currentRole: req.user.role,
  });
};

/**
 * Check if user can manage property (own property or admin)
 * @middleware
 */
const canManageProperty = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Admin can manage any property
    if (req.user.role === "admin") {
      return next();
    }

    // Must be seller or both
    if (req.user.role !== "seller" && req.user.role !== "both") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can manage properties",
        currentRole: req.user.role,
      });
    }

    const propertyId = req.params.id || req.params.propertyId;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        message: "Property ID is required",
      });
    }

    // Import Property model here to avoid circular dependency
    const Property = require("../models/Property");
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Check if user owns the property
    if (property.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only manage your own properties",
      });
    }

    // Attach property to request for use in controller
    req.property = property;
    next();
  } catch (error) {
    console.error("Property management check error:", error);
    return res.status(500).json({
      success: false,
      message: "Property access check failed",
    });
  }
};

/**
 * Check if user can respond to inquiry (seller of the property or admin)
 * @middleware
 */
const canRespondToInquiry = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Admin can respond to any inquiry
    if (req.user.role === "admin") {
      return next();
    }

    const inquiryId = req.params.id || req.params.inquiryId;

    if (!inquiryId) {
      return res.status(400).json({
        success: false,
        message: "Inquiry ID is required",
      });
    }

    const Inquiry = require("../models/Inquiry");
    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: "Inquiry not found",
      });
    }

    // Check if user is the seller
    if (inquiry.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only respond to inquiries for your properties",
      });
    }

    req.inquiry = inquiry;
    next();
  } catch (error) {
    console.error("Inquiry response check error:", error);
    return res.status(500).json({
      success: false,
      message: "Inquiry access check failed",
    });
  }
};

/**
 * Allow role switching between buyer and both
 * @middleware
 */
const allowRoleUpgrade = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  const { newRole } = req.body;

  // Validate role upgrade path
  const validUpgrades = {
    buyer: ["both"],
    seller: ["both"],
    both: [], // Cannot upgrade from both
  };

  if (
    !validUpgrades[req.user.role] ||
    !validUpgrades[req.user.role].includes(newRole)
  ) {
    return res.status(403).json({
      success: false,
      message: `Cannot upgrade from ${req.user.role} to ${newRole}`,
      allowedUpgrades: validUpgrades[req.user.role],
    });
  }

  next();
};

/**
 * Get user permissions
 * @param {Object} user - User object
 * @returns {Array} Array of permissions
 */
const getUserPermissions = (user) => {
  if (!user || !user.role) {
    return [];
  }
  return ROLE_PERMISSIONS[user.role] || [];
};

/**
 * Check if user has specific permission (utility function)
 * @param {Object} user - User object
 * @param {String} permission - Permission to check
 * @returns {Boolean} True if has permission
 */
const hasPermission = (user, permission) => {
  const permissions = getUserPermissions(user);
  return permissions.includes(permission);
};

/**
 * Attach user permissions to request
 * @middleware
 */
const attachPermissions = (req, res, next) => {
  if (req.user) {
    req.userPermissions = getUserPermissions(req.user);
  } else {
    req.userPermissions = [];
  }
  next();
};

module.exports = {
  // Permission-based checks
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,

  // Role hierarchy
  checkRoleHierarchy,

  // Resource-specific access
  canAccess,
  canBuyProperty,
  canSellProperty,
  canManageProperty,
  canRespondToInquiry,

  // Role management
  allowRoleUpgrade,

  // Utility functions
  getUserPermissions,
  hasPermission,
  attachPermissions,

  // Constants
  ROLE_HIERARCHY,
  ROLE_PERMISSIONS,
};
