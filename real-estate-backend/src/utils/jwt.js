const jwt = require("jsonwebtoken");

/**
 * Generate JWT Access Token
 * @param {Object} payload - User data to include in token
 * @param {String} payload.id - User ID
 * @param {String} payload.email - User email
 * @param {String} payload.role - User role
 * @returns {String} JWT token
 */
const generateAccessToken = (payload) => {
  try {
    const { id, email, role } = payload;

    if (!id || !email || !role) {
      throw new Error("Missing required payload fields: id, email, or role");
    }

    const token = jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || "7d",
      issuer: "jaipur-real-estate",
      audience: "jaipur-real-estate-users",
    });

    return token;
  } catch (error) {
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

/**
 * Generate JWT Refresh Token
 * @param {Object} payload - User data to include in token
 * @param {String} payload.id - User ID
 * @returns {String} Refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    const { id } = payload;

    if (!id) {
      throw new Error("Missing required payload field: id");
    }

    const token = jwt.sign(
      { id },
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
        issuer: "jaipur-real-estate",
        audience: "jaipur-real-estate-refresh",
      }
    );

    return token;
  } catch (error) {
    throw new Error(`Refresh token generation failed: ${error.message}`);
  }
};

/**
 * Generate Email Verification Token
 * @param {String} userId - User ID
 * @param {String} email - User email
 * @returns {String} Verification token
 */
const generateEmailVerificationToken = (userId, email) => {
  try {
    if (!userId || !email) {
      throw new Error("User ID and email are required");
    }

    const token = jwt.sign(
      { id: userId, email, type: "email_verification" },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
        issuer: "jaipur-real-estate",
        audience: "jaipur-real-estate-verification",
      }
    );

    return token;
  } catch (error) {
    throw new Error(
      `Email verification token generation failed: ${error.message}`
    );
  }
};

/**
 * Generate Password Reset Token
 * @param {String} userId - User ID
 * @param {String} email - User email
 * @returns {String} Reset token
 */
const generatePasswordResetToken = (userId, email) => {
  try {
    if (!userId || !email) {
      throw new Error("User ID and email are required");
    }

    const token = jwt.sign(
      { id: userId, email, type: "password_reset" },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
        issuer: "jaipur-real-estate",
        audience: "jaipur-real-estate-reset",
      }
    );

    return token;
  } catch (error) {
    throw new Error(`Password reset token generation failed: ${error.message}`);
  }
};

/**
 * Verify JWT Token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "jaipur-real-estate",
    });

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    } else if (error.name === "NotBeforeError") {
      throw new Error("Token not active yet");
    } else {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }
};

/**
 * Verify Refresh Token
 * @param {String} token - Refresh token to verify
 * @returns {Object} Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    if (!token) {
      throw new Error("Refresh token is required");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        issuer: "jaipur-real-estate",
        audience: "jaipur-real-estate-refresh",
      }
    );

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Refresh token has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid refresh token");
    } else {
      throw new Error(`Refresh token verification failed: ${error.message}`);
    }
  }
};

/**
 * Verify Email Verification Token
 * @param {String} token - Email verification token
 * @returns {Object} Decoded token payload
 */
const verifyEmailVerificationToken = (token) => {
  try {
    if (!token) {
      throw new Error("Verification token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "jaipur-real-estate",
      audience: "jaipur-real-estate-verification",
    });

    if (decoded.type !== "email_verification") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Verification link has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid verification token");
    } else {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }
};

/**
 * Verify Password Reset Token
 * @param {String} token - Password reset token
 * @returns {Object} Decoded token payload
 */
const verifyPasswordResetToken = (token) => {
  try {
    if (!token) {
      throw new Error("Reset token is required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: "jaipur-real-estate",
      audience: "jaipur-real-estate-reset",
    });

    if (decoded.type !== "password_reset") {
      throw new Error("Invalid token type");
    }

    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Reset link has expired");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid reset token");
    } else {
      throw new Error(`Password reset verification failed: ${error.message}`);
    }
  }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    if (!token) {
      throw new Error("Token is required");
    }

    const decoded = jwt.decode(token, { complete: true });
    return decoded;
  } catch (error) {
    throw new Error(`Token decoding failed: ${error.message}`);
  }
};

/**
 * Check if token is expired without throwing error
 * @param {String} token - JWT token
 * @returns {Boolean} True if expired, false otherwise
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration date
 * @param {String} token - JWT token
 * @returns {Date|null} Expiration date or null
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Get remaining token validity time in seconds
 * @param {String} token - JWT token
 * @returns {Number} Remaining seconds or 0 if expired
 */
const getTokenRemainingTime = (token) => {
  try {
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = decoded.exp - currentTime;

    return remaining > 0 ? remaining : 0;
  } catch (error) {
    return 0;
  }
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - Authorization header value
 * @returns {String|null} Token or null
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7); // Remove 'Bearer ' prefix
};

/**
 * Generate both access and refresh tokens
 * @param {Object} payload - User data
 * @returns {Object} Object containing both tokens
 */
const generateTokenPair = (payload) => {
  try {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE || "7d",
      tokenType: "Bearer",
    };
  } catch (error) {
    throw new Error(`Token pair generation failed: ${error.message}`);
  }
};

module.exports = {
  // Generate tokens
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateTokenPair,

  // Verify tokens
  verifyToken,
  verifyRefreshToken,
  verifyEmailVerificationToken,
  verifyPasswordResetToken,

  // Utility functions
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
  getTokenRemainingTime,
  extractTokenFromHeader,
};
