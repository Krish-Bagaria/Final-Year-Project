const User = require("../models/User");
const { hashPassword } = require("../utils/bcrypt");

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch profile",
    });
  }
};

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
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
    } = req.body;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if phone is being changed and if it's already taken
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone, _id: { $ne: userId } });
      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use",
        });
      }
      user.phone = phone;
      user.isPhoneVerified = false; // Require re-verification
    }

    // Update allowed fields
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (address) user.address = address;
    if (city) user.city = city;
    if (state) user.state = state;
    if (pincode) user.pincode = pincode;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: userResponse,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile",
    });
  }
};

/**
 * @route   PUT /api/users/preferences
 * @desc    Update user preferences
 * @access  Private
 */
const updatePreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== "object") {
      return res.status(400).json({
        success: false,
        message: "Valid preferences object is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Merge preferences
    user.preferences = {
      ...user.preferences,
      ...preferences,
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Preferences updated successfully",
      data: {
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update preferences",
    });
  }
};

/**
 * @route   PUT /api/users/avatar
 * @desc    Update user avatar
 * @access  Private
 */
const updateAvatar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Avatar URL is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: {
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Update avatar error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update avatar",
    });
  }
};

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account (soft delete)
 * @access  Private
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const { password, confirmDelete } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      });
    }

    if (confirmDelete !== "DELETE MY ACCOUNT") {
      return res.status(400).json({
        success: false,
        message:
          'Please confirm account deletion by typing "DELETE MY ACCOUNT"',
      });
    }

    // Find user with password
    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const { comparePassword } = require("../utils/bcrypt");
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Soft delete
    user.isActive = false;
    user.deletedAt = Date.now();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete account",
    });
  }
};

/**
 * @route   PUT /api/users/role
 * @desc    Update user role (buyer -> both, seller -> both)
 * @access  Private
 */
const updateRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const { newRole } = req.body;

    if (!newRole) {
      return res.status(400).json({
        success: false,
        message: "New role is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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
      return res.status(403).json({
        success: false,
        message: `Cannot upgrade from ${user.role} to ${newRole}`,
        currentRole: user.role,
        allowedUpgrades: allowedRoles,
      });
    }

    user.role = newRole;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Role upgraded to ${newRole} successfully`,
      data: {
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update role error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update role",
    });
  }
};

/**
 * @route   GET /api/users/:userId
 * @desc    Get user by ID (public profile)
 * @access  Public
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select("name email phone bio avatar city state role createdAt")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch user",
    });
  }
};

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin only)
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      isActive,
      isEmailVerified,
      sortBy = "-createdAt",
    } = req.query;

    const skip = (page - 1) * limit;
    const query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === "true";
    if (isEmailVerified !== undefined)
      query.isEmailVerified = isEmailVerified === "true";

    const users = await User.find(query)
      .select("-password")
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user's property count (if seller)
    const Property = require("../models/Property");
    const propertyCount = await Property.countDocuments({
      seller: userId,
      isActive: true,
    });

    // Get user's favorite count (if buyer)
    const Favorite = require("../models/Favorite");
    const favoriteCount = await Favorite.countDocuments({
      user: userId,
      isActive: true,
    });

    // Get user's inquiry count
    const Inquiry = require("../models/Inquiry");
    const sentInquiries = await Inquiry.countDocuments({
      buyer: userId,
      isActive: true,
    });

    const receivedInquiries = await Inquiry.countDocuments({
      seller: userId,
      isActive: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        stats: {
          propertiesListed: propertyCount,
          favoritesCount: favoriteCount,
          inquiriesSent: sentInquiries,
          inquiriesReceived: receivedInquiries,
        },
      },
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch statistics",
    });
  }
};

/**
 * @route   PUT /api/users/:userId/block
 * @desc    Block user (Admin only)
 * @access  Private/Admin
 */
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot block admin users",
      });
    }

    user.isBlocked = true;
    user.blockedReason = reason || "Blocked by admin";
    user.blockedAt = Date.now();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: {
        userId: user._id,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("Block user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to block user",
    });
  }
};

/**
 * @route   PUT /api/users/:userId/unblock
 * @desc    Unblock user (Admin only)
 * @access  Private/Admin
 */
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isBlocked = false;
    user.blockedReason = undefined;
    user.blockedAt = undefined;
    user.loginAttempts.count = 0;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: {
        userId: user._id,
        isBlocked: user.isBlocked,
      },
    });
  } catch (error) {
    console.error("Unblock user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to unblock user",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updatePreferences,
  updateAvatar,
  deleteAccount,
  updateRole,
  getUserById,
  getAllUsers,
  getUserStats,
  blockUser,
  unblockUser,
};
