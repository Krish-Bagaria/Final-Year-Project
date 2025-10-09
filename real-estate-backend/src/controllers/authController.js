const authService = require("../services/authService");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, preferences } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, password, phone",
      });
    }

    // Call service
    const result = await authService.registerUser({
      name,
      email,
      password,
      phone,
      role,
      preferences,
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
        verificationToken: result.verificationToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Registration failed",
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Call service
    const result = await authService.loginUser({ email, password });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(401).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    // Call service
    await authService.logoutUser(userId);

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Logout failed",
    });
  }
};

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    // Call service
    const result = await authService.verifyEmail(token);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Email verification failed",
    });
  }
};

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Public
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Call service
    const result = await authService.resendEmailVerification(email);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        verificationToken: result.verificationToken,
      },
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to resend verification email",
    });
  }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Call service
    const result = await authService.requestPasswordReset(email);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        resetToken: result.resetToken,
      },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process password reset request",
    });
  }
};

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Reset password with token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Reset token is required",
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirmation are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // Call service
    const result = await authService.resetPassword(token, newPassword);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Password reset failed",
    });
  }
};

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change password (authenticated user)
 * @access  Private
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Current password, new password, and confirmation are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match",
      });
    }

    // Call service
    const result = await authService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Change password error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Password change failed",
    });
  }
};

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Call service
    const result = await authService.refreshAccessToken(refreshToken);

    // Set new refresh token in cookie
    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        accessToken: result.tokens.accessToken,
        expiresIn: result.tokens.expiresIn,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res.status(401).json({
      success: false,
      message: error.message || "Token refresh failed",
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getCurrentUser = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = req.user;

    return res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get user data",
    });
  }
};

/**
 * @route   POST /api/auth/check-email
 * @desc    Check if email is available
 * @access  Public
 */
const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Call service
    const result = await authService.checkEmailAvailability(email);

    return res.status(200).json({
      success: true,
      data: {
        available: result.available,
        message: result.message,
      },
    });
  } catch (error) {
    console.error("Check email error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Email check failed",
    });
  }
};

/**
 * @route   POST /api/auth/check-phone
 * @desc    Check if phone is available
 * @access  Public
 */
const checkPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    // Call service
    const result = await authService.checkPhoneAvailability(phone);

    return res.status(200).json({
      success: true,
      data: {
        available: result.available,
        message: result.message,
      },
    });
  } catch (error) {
    console.error("Check phone error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Phone check failed",
    });
  }
};

/**
 * @route   POST /api/auth/send-phone-otp
 * @desc    Send OTP to phone
 * @access  Private
 */
const sendPhoneOTP = async (req, res) => {
  try {
    const userId = req.user.id;

    // Call service
    const result = await authService.sendPhoneOTP(userId);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: {
        // Only send OTP in development mode
        otp: result.otp,
      },
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to send OTP",
    });
  }
};

/**
 * @route   POST /api/auth/verify-phone
 * @desc    Verify phone with OTP
 * @access  Private
 */
const verifyPhone = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    // Call service
    const result = await authService.verifyPhone(userId, otp);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Verify phone error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Phone verification failed",
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  getCurrentUser,
  checkEmail,
  checkPhone,
  sendPhoneOTP,
  verifyPhone,
};
