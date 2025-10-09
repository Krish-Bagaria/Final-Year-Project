const User = require("../models/User");
const {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
} = require("../utils/bcrypt");
const {
  generateTokenPair,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken,
} = require("../utils/jwt");
const crypto = require("crypto");

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user and tokens
 */
const registerUser = async (userData) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role = "buyer",
      preferences = {},
    } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        throw new Error("Email already registered");
      }
      if (existingUser.phone === phone) {
        throw new Error("Phone number already registered");
      }
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new Error(`Weak password: ${passwordValidation.errors.join(", ")}`);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role,
      preferences,
      isEmailVerified: false,
      isPhoneVerified: false,
    });

    // Generate email verification token
    const verificationToken = generateEmailVerificationToken(
      user._id,
      user.email
    );

    // Generate authentication tokens
    const tokens = generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      tokens,
      verificationToken,
      message: "Registration successful. Please verify your email.",
    };
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @returns {Promise<Object>} User data and tokens
 */
const loginUser = async (credentials) => {
  try {
    const { email, password } = credentials;

    // Find user by email
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    }).select("+password");

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if account is blocked
    if (user.isBlocked) {
      throw new Error("Account is blocked. Please contact support.");
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      // Increment failed login attempts
      user.loginAttempts.count += 1;
      user.loginAttempts.lastAttempt = Date.now();

      // Block account after 5 failed attempts
      if (user.loginAttempts.count >= 5) {
        user.isBlocked = true;
        user.blockedReason = "Too many failed login attempts";
        user.blockedAt = Date.now();
        await user.save();
        throw new Error(
          "Account blocked due to too many failed login attempts"
        );
      }

      await user.save();
      throw new Error("Invalid email or password");
    }

    // Reset login attempts on successful login
    user.loginAttempts.count = 0;
    user.lastLogin = Date.now();
    await user.save();

    // Generate tokens
    const tokens = generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    return {
      user: userResponse,
      tokens,
      message: "Login successful",
    };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

/**
 * Verify email address
 * @param {String} token - Email verification token
 * @returns {Promise<Object>} Success message
 */
const verifyEmail = async (token) => {
  try {
    // Verify token
    const decoded = verifyEmailVerificationToken(token);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      return {
        message: "Email already verified",
      };
    }

    // Update user
    user.isEmailVerified = true;
    user.emailVerifiedAt = Date.now();
    await user.save();

    return {
      message: "Email verified successfully",
    };
  } catch (error) {
    throw new Error(`Email verification failed: ${error.message}`);
  }
};

/**
 * Request password reset
 * @param {String} email - User email
 * @returns {Promise<Object>} Reset token
 */
const requestPasswordReset = async (email) => {
  try {
    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      // Don't reveal if email exists (security)
      return {
        message: "If the email exists, a password reset link has been sent",
      };
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken(user._id, user.email);

    // Store reset token hash in database (optional, for extra security)
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    return {
      resetToken,
      message: "Password reset link has been sent to your email",
    };
  } catch (error) {
    throw new Error(`Password reset request failed: ${error.message}`);
  }
};

/**
 * Reset password with token
 * @param {String} token - Password reset token
 * @param {String} newPassword - New password
 * @returns {Promise<Object>} Success message
 */
const resetPassword = async (token, newPassword) => {
  try {
    // Verify token
    const decoded = verifyPasswordResetToken(token);

    // Find user
    const user = await User.findById(decoded.id).select(
      "+password +passwordResetToken +passwordResetExpires"
    );

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    // Check if token has expired
    if (user.passwordResetExpires && user.passwordResetExpires < Date.now()) {
      throw new Error("Reset token has expired");
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`Weak password: ${passwordValidation.errors.join(", ")}`);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    return {
      message:
        "Password reset successful. You can now login with your new password",
    };
  } catch (error) {
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

/**
 * Change password (authenticated user)
 * @param {String} userId - User ID
 * @param {String} currentPassword - Current password
 * @param {String} newPassword - New password
 * @returns {Promise<Object>} Success message
 */
const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    // Find user
    const user = await User.findById(userId).select("+password");

    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Check if new password is same as current
    const isSamePassword = await comparePassword(newPassword, user.password);
    if (isSamePassword) {
      throw new Error("New password must be different from current password");
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(`Weak password: ${passwordValidation.errors.join(", ")}`);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    return {
      message: "Password changed successfully",
    };
  } catch (error) {
    throw new Error(`Password change failed: ${error.message}`);
  }
};

/**
 * Logout user (optionally invalidate token)
 * @param {String} userId - User ID
 * @returns {Promise<Object>} Success message
 */
const logoutUser = async (userId) => {
  try {
    // Optional: Store token in blacklist (Redis recommended)
    // For now, just return success (client will delete token)

    return {
      message: "Logout successful",
    };
  } catch (error) {
    throw new Error(`Logout failed: ${error.message}`);
  }
};

/**
 * Refresh access token
 * @param {String} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    const { verifyRefreshToken } = require("../utils/jwt");

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      throw new Error("User not found or inactive");
    }

    // Generate new token pair
    const tokens = generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return {
      tokens,
      message: "Token refreshed successfully",
    };
  } catch (error) {
    throw new Error(`Token refresh failed: ${error.message}`);
  }
};

/**
 * Resend email verification
 * @param {String} email - User email
 * @returns {Promise<Object>} Verification token
 */
const resendEmailVerification = async (email) => {
  try {
    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
      isActive: true,
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isEmailVerified) {
      throw new Error("Email already verified");
    }

    // Generate new verification token
    const verificationToken = generateEmailVerificationToken(
      user._id,
      user.email
    );

    return {
      verificationToken,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    throw new Error(`Resend verification failed: ${error.message}`);
  }
};

/**
 * Check if email is available
 * @param {String} email - Email to check
 * @returns {Promise<Object>} Availability status
 */
const checkEmailAvailability = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    return {
      available: !user,
      message: user ? "Email already registered" : "Email is available",
    };
  } catch (error) {
    throw new Error(`Email check failed: ${error.message}`);
  }
};

/**
 * Check if phone is available
 * @param {String} phone - Phone to check
 * @returns {Promise<Object>} Availability status
 */
const checkPhoneAvailability = async (phone) => {
  try {
    const user = await User.findOne({ phone });

    return {
      available: !user,
      message: user
        ? "Phone number already registered"
        : "Phone number is available",
    };
  } catch (error) {
    throw new Error(`Phone check failed: ${error.message}`);
  }
};

/**
 * Verify phone number with OTP
 * @param {String} userId - User ID
 * @param {String} otp - OTP code
 * @returns {Promise<Object>} Success message
 */
const verifyPhone = async (userId, otp) => {
  try {
    // Find user
    const user = await User.findById(userId).select(
      "+phoneOTP +phoneOTPExpires"
    );

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isPhoneVerified) {
      return {
        message: "Phone already verified",
      };
    }

    // Check if OTP exists and not expired
    if (!user.phoneOTP || !user.phoneOTPExpires) {
      throw new Error("No OTP found. Please request a new one");
    }

    if (user.phoneOTPExpires < Date.now()) {
      throw new Error("OTP has expired. Please request a new one");
    }

    // Verify OTP
    if (user.phoneOTP !== otp) {
      throw new Error("Invalid OTP");
    }

    // Update user
    user.isPhoneVerified = true;
    user.phoneVerifiedAt = Date.now();
    user.phoneOTP = undefined;
    user.phoneOTPExpires = undefined;
    await user.save();

    return {
      message: "Phone verified successfully",
    };
  } catch (error) {
    throw new Error(`Phone verification failed: ${error.message}`);
  }
};

/**
 * Send phone OTP
 * @param {String} userId - User ID
 * @returns {Promise<Object>} OTP (in development, would be sent via SMS)
 */
const sendPhoneOTP = async (userId) => {
  try {
    // Find user
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isPhoneVerified) {
      throw new Error("Phone already verified");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP (expires in 10 minutes)
    user.phoneOTP = otp;
    user.phoneOTPExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // In production, send OTP via SMS service (Twilio, AWS SNS, etc.)
    // For development, return OTP
    return {
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
      message: "OTP sent to your phone number",
    };
  } catch (error) {
    throw new Error(`Send OTP failed: ${error.message}`);
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  logoutUser,
  refreshAccessToken,
  resendEmailVerification,
  checkEmailAvailability,
  checkPhoneAvailability,
  verifyPhone,
  sendPhoneOTP,
};
