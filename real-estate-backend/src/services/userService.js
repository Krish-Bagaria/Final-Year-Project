const User = require("../models/User");
const { hashPassword } = require("../utils/bcrypt");

/**
 * Get user by ID
 * @param {String} userId - User ID
 * @param {Object} options - Query options
 * @returns {Promise<Object>} User object
 */
const getUserById = async (userId, options = {}) => {
  try {
    const { includePassword = false, includeDeleted = false } = options;

    let query = User.findById(userId);

    if (includePassword) {
      query = query.select("+password");
    } else {
      query = query.select("-password");
    }

    if (!includeDeleted) {
      query = query.where("isActive").equals(true);
    }

    const user = await query.lean();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

/**
 * Get user by email
 * @param {String} email - User email
 * @param {Object} options - Query options
 * @returns {Promise<Object>} User object
 */
const getUserByEmail = async (email, options = {}) => {
  try {
    const { includePassword = false } = options;

    let query = User.findOne({ email: email.toLowerCase() });

    if (includePassword) {
      query = query.select("+password");
    } else {
      query = query.select("-password");
    }

    const user = await query.lean();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

/**
 * Get user by phone
 * @param {String} phone - User phone number
 * @returns {Promise<Object>} User object
 */
const getUserByPhone = async (phone) => {
  try {
    const user = await User.findOne({ phone }).select("-password").lean();

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

/**
 * Update user profile
 * @param {String} userId - User ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} Updated user
 */
const updateUserProfile = async (userId, updateData) => {
  try {
    const {
      name,
      phone,
      bio,
      address,
      city,
      state,
      pincode,
      avatar,
      preferences,
    } = updateData;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Check if phone is being changed
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({
        phone,
        _id: { $ne: userId },
      });

      if (phoneExists) {
        throw new Error("Phone number already in use");
      }

      user.phone = phone;
      user.isPhoneVerified = false; // Require re-verification
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;

    if (preferences !== undefined) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    await user.save();

    // Return user without password
    const updatedUser = user.toObject();
    delete updatedUser.password;

    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
};

/**
 * Update user preferences
 * @param {String} userId - User ID
 * @param {Object} preferences - User preferences
 * @returns {Promise<Object>} Updated preferences
 */
const updateUserPreferences = async (userId, preferences) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    await user.save();

    return user.preferences;
  } catch (error) {
    throw new Error(`Failed to update preferences: ${error.message}`);
  }
};

/**
 * Update user avatar
 * @param {String} userId - User ID
 * @param {String} avatarUrl - Avatar URL
 * @returns {Promise<String>} Updated avatar URL
 */
const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user.avatar;
  } catch (error) {
    throw new Error(`Failed to update avatar: ${error.message}`);
  }
};

/**
 * Delete user account (soft delete)
 * @param {String} userId - User ID
 * @param {String} password - User password for confirmation
 * @returns {Promise<Object>} Deletion result
 */
const deleteUserAccount = async (userId, password) => {
  try {
    const { comparePassword } = require("../utils/bcrypt");

    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }

    // Soft delete
    user.isActive = false;
    user.deletedAt = Date.now();
    await user.save();

    return {
      message: "Account deleted successfully",
      deletedAt: user.deletedAt,
    };
  } catch (error) {
    throw new Error(`Failed to delete account: ${error.message}`);
  }
};

/**
 * Update user role
 * @param {String} userId - User ID
 * @param {String} newRole - New role
 * @returns {Promise<Object>} Updated role
 */
const updateUserRole = async (userId, newRole) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Validate role upgrade path
    const validUpgrades = {
      buyer: ["both"],
      seller: ["both"],
      both: [],
      admin: [],
    };

    const allowedRoles = validUpgrades[user.role] || [];

    if (!allowedRoles.includes(newRole)) {
      throw new Error(`Cannot upgrade from ${user.role} to ${newRole}`);
    }

    user.role = newRole;
    await user.save();

    return {
      role: user.role,
      message: `Role upgraded to ${newRole} successfully`,
    };
  } catch (error) {
    throw new Error(`Failed to update role: ${error.message}`);
  }
};

/**
 * Get all users with filters
 * @param {Object} filters - Query filters
 * @returns {Promise<Object>} Users with pagination
 */
const getAllUsers = async (filters = {}) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      isEmailVerified,
      isPhoneVerified,
      search,
      sortBy = "-createdAt",
    } = filters;

    const skip = (page - 1) * limit;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;
    if (isEmailVerified !== undefined) query.isEmailVerified = isEmailVerified;
    if (isPhoneVerified !== undefined) query.isPhoneVerified = isPhoneVerified;

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

/**
 * Get user statistics
 * @param {String} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
const getUserStatistics = async (userId) => {
  try {
    const Property = require("../models/Property");
    const Favorite = require("../models/Favorite");
    const Inquiry = require("../models/Inquiry");

    // Get property count (seller)
    const propertyCount = await Property.countDocuments({
      seller: userId,
      isActive: true,
    });

    // Get property views (seller)
    const propertyViews = await Property.aggregate([
      {
        $match: {
          seller: userId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$viewCount" },
          totalUniqueViews: { $sum: "$uniqueViews" },
        },
      },
    ]);

    // Get favorite count (buyer)
    const favoriteCount = await Favorite.countDocuments({
      user: userId,
      isActive: true,
    });

    // Get inquiry counts
    const sentInquiries = await Inquiry.countDocuments({
      buyer: userId,
      isActive: true,
    });

    const receivedInquiries = await Inquiry.countDocuments({
      seller: userId,
      isActive: true,
    });

    const pendingInquiries = await Inquiry.countDocuments({
      seller: userId,
      status: "pending",
      isActive: true,
    });

    return {
      propertiesListed: propertyCount,
      totalPropertyViews: propertyViews[0]?.totalViews || 0,
      uniquePropertyViews: propertyViews[0]?.totalUniqueViews || 0,
      favoritesCount: favoriteCount,
      inquiriesSent: sentInquiries,
      inquiriesReceived: receivedInquiries,
      pendingInquiries: pendingInquiries,
    };
  } catch (error) {
    throw new Error(`Failed to fetch statistics: ${error.message}`);
  }
};

/**
 * Block user
 * @param {String} userId - User ID to block
 * @param {String} reason - Block reason
 * @param {String} adminId - Admin ID performing the action
 * @returns {Promise<Object>} Block result
 */
const blockUser = async (userId, reason, adminId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "admin") {
      throw new Error("Cannot block admin users");
    }

    user.isBlocked = true;
    user.blockedReason = reason || "Blocked by admin";
    user.blockedAt = Date.now();
    user.blockedBy = adminId;
    await user.save();

    return {
      userId: user._id,
      isBlocked: user.isBlocked,
      blockedReason: user.blockedReason,
      message: "User blocked successfully",
    };
  } catch (error) {
    throw new Error(`Failed to block user: ${error.message}`);
  }
};

/**
 * Unblock user
 * @param {String} userId - User ID to unblock
 * @returns {Promise<Object>} Unblock result
 */
const unblockUser = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.isBlocked = false;
    user.blockedReason = undefined;
    user.blockedAt = undefined;
    user.blockedBy = undefined;
    user.loginAttempts.count = 0; // Reset failed login attempts
    await user.save();

    return {
      userId: user._id,
      isBlocked: user.isBlocked,
      message: "User unblocked successfully",
    };
  } catch (error) {
    throw new Error(`Failed to unblock user: ${error.message}`);
  }
};

/**
 * Search users
 * @param {String} searchTerm - Search term
 * @param {Object} options - Search options
 * @returns {Promise<Array>} Matching users
 */
const searchUsers = async (searchTerm, options = {}) => {
  try {
    const { limit = 10, role } = options;

    const query = {
      isActive: true,
      $or: [
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ],
    };

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select("name email avatar role city")
      .limit(limit)
      .lean();

    return users;
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
};

/**
 * Check if user exists
 * @param {Object} criteria - Search criteria (email or phone)
 * @returns {Promise<Boolean>} True if exists
 */
const userExists = async (criteria) => {
  try {
    const user = await User.findOne(criteria);
    return !!user;
  } catch (error) {
    throw new Error(`User check failed: ${error.message}`);
  }
};

/**
 * Get user activity summary
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Activity summary
 */
const getUserActivity = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    const Property = require("../models/Property");
    const Inquiry = require("../models/Inquiry");

    // Get recent properties (if seller)
    const recentProperties = await Property.find({
      seller: userId,
      isActive: true,
    })
      .select("title type price images createdAt viewCount")
      .sort("-createdAt")
      .limit(5)
      .lean();

    // Get recent inquiries
    const recentInquiries = await Inquiry.find({
      $or: [{ buyer: userId }, { seller: userId }],
      isActive: true,
    })
      .populate("property", "title type price")
      .sort("-createdAt")
      .limit(5)
      .lean();

    return {
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
      recentProperties,
      recentInquiries,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user activity: ${error.message}`);
  }
};

/**
 * Verify user ownership
 * @param {String} userId - User ID
 * @param {String} resourceUserId - Resource owner ID
 * @returns {Boolean} True if owner
 */
const verifyOwnership = (userId, resourceUserId) => {
  return userId.toString() === resourceUserId.toString();
};

module.exports = {
  getUserById,
  getUserByEmail,
  getUserByPhone,
  updateUserProfile,
  updateUserPreferences,
  updateUserAvatar,
  deleteUserAccount,
  updateUserRole,
  getAllUsers,
  getUserStatistics,
  blockUser,
  unblockUser,
  searchUsers,
  userExists,
  getUserActivity,
  verifyOwnership,
};
