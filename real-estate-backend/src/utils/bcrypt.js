const bcrypt = require("bcryptjs");

/**
 * Default salt rounds for bcrypt hashing
 * Higher number = more secure but slower
 * 10-12 is recommended for production
 */
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * Hash a plain text password
 * @param {String} password - Plain text password
 * @returns {Promise<String>} Hashed password
 */
const hashPassword = async (password) => {
  try {
    // Validate password
    if (!password) {
      throw new Error("Password is required");
    }

    if (typeof password !== "string") {
      throw new Error("Password must be a string");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (password.length > 128) {
      throw new Error("Password is too long (max 128 characters)");
    }

    // Generate salt
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    // Hash password with salt
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};

/**
 * Compare plain text password with hashed password
 * @param {String} plainPassword - Plain text password to compare
 * @param {String} hashedPassword - Hashed password from database
 * @returns {Promise<Boolean>} True if passwords match, false otherwise
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    // Validate inputs
    if (!plainPassword || !hashedPassword) {
      throw new Error("Both plain and hashed passwords are required");
    }

    if (
      typeof plainPassword !== "string" ||
      typeof hashedPassword !== "string"
    ) {
      throw new Error("Passwords must be strings");
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    return isMatch;
  } catch (error) {
    // Don't expose internal errors for security
    if (
      error.message.includes("required") ||
      error.message.includes("must be")
    ) {
      throw error;
    }
    throw new Error("Password comparison failed");
  }
};

/**
 * Hash password synchronously (use only when necessary)
 * @param {String} password - Plain text password
 * @returns {String} Hashed password
 */
const hashPasswordSync = (password) => {
  try {
    // Validate password
    if (!password) {
      throw new Error("Password is required");
    }

    if (typeof password !== "string") {
      throw new Error("Password must be a string");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    if (password.length > 128) {
      throw new Error("Password is too long (max 128 characters)");
    }

    // Generate salt and hash
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = bcrypt.hashSync(password, salt);

    return hashedPassword;
  } catch (error) {
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};

/**
 * Compare passwords synchronously (use only when necessary)
 * @param {String} plainPassword - Plain text password
 * @param {String} hashedPassword - Hashed password
 * @returns {Boolean} True if match, false otherwise
 */
const comparePasswordSync = (plainPassword, hashedPassword) => {
  try {
    // Validate inputs
    if (!plainPassword || !hashedPassword) {
      throw new Error("Both plain and hashed passwords are required");
    }

    if (
      typeof plainPassword !== "string" ||
      typeof hashedPassword !== "string"
    ) {
      throw new Error("Passwords must be strings");
    }

    // Compare passwords
    const isMatch = bcrypt.compareSync(plainPassword, hashedPassword);

    return isMatch;
  } catch (error) {
    if (
      error.message.includes("required") ||
      error.message.includes("must be")
    ) {
      throw error;
    }
    throw new Error("Password comparison failed");
  }
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} Validation result with strength and suggestions
 */
const validatePasswordStrength = (password) => {
  const result = {
    isValid: true,
    strength: "weak",
    score: 0,
    errors: [],
    suggestions: [],
  };

  // Check if password exists
  if (!password) {
    result.isValid = false;
    result.errors.push("Password is required");
    return result;
  }

  // Check minimum length
  if (password.length < 8) {
    result.isValid = false;
    result.errors.push("Password must be at least 8 characters long");
    result.suggestions.push("Use at least 8 characters");
  } else if (password.length >= 8) {
    result.score += 20;
  }

  // Check maximum length
  if (password.length > 128) {
    result.isValid = false;
    result.errors.push("Password is too long (max 128 characters)");
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    result.score += 20;
  } else {
    result.suggestions.push("Include lowercase letters");
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    result.score += 20;
  } else {
    result.suggestions.push("Include uppercase letters");
  }

  // Check for numbers
  if (/\d/.test(password)) {
    result.score += 20;
  } else {
    result.suggestions.push("Include numbers");
  }

  // Check for special characters
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.score += 20;
  } else {
    result.suggestions.push("Include special characters (!@#$%^&*)");
  }

  // Check for common patterns
  const commonPatterns = [
    /^123/i,
    /^abc/i,
    /^password/i,
    /^qwerty/i,
    /12345/,
    /admin/,
    /letmein/,
    /welcome/,
  ];

  if (commonPatterns.some((pattern) => pattern.test(password))) {
    result.score -= 30;
    result.suggestions.push("Avoid common patterns and words");
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    result.score -= 10;
    result.suggestions.push("Avoid repeated characters");
  }

  // Calculate strength
  if (result.score >= 80) {
    result.strength = "strong";
  } else if (result.score >= 60) {
    result.strength = "medium";
  } else if (result.score >= 40) {
    result.strength = "fair";
  } else {
    result.strength = "weak";
  }

  // For weak passwords, mark as invalid
  if (result.strength === "weak") {
    result.isValid = false;
  }

  return result;
};

/**
 * Generate a random password
 * @param {Number} length - Password length (default 12)
 * @param {Object} options - Generation options
 * @returns {String} Generated password
 */
const generateRandomPassword = (length = 12, options = {}) => {
  const {
    includeUppercase = true,
    includeLowercase = true,
    includeNumbers = true,
    includeSpecial = true,
  } = options;

  let charset = "";
  let password = "";

  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeNumbers) charset += "0123456789";
  if (includeSpecial) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (charset === "") {
    throw new Error("At least one character type must be included");
  }

  // Ensure at least one character from each enabled type
  if (includeLowercase) {
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
  }
  if (includeUppercase) {
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
  }
  if (includeNumbers) {
    password += "0123456789"[Math.floor(Math.random() * 10)];
  }
  if (includeSpecial) {
    const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    password += special[Math.floor(Math.random() * special.length)];
  }

  // Fill remaining length
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }

  // Shuffle the password
  password = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return password;
};

/**
 * Check if a string is already hashed with bcrypt
 * @param {String} str - String to check
 * @returns {Boolean} True if bcrypt hash, false otherwise
 */
const isBcryptHash = (str) => {
  if (!str || typeof str !== "string") {
    return false;
  }

  // Bcrypt hashes start with $2a$, $2b$, or $2y$
  const bcryptRegex = /^\$2[ayb]\$\d{2}\$.{53}$/;
  return bcryptRegex.test(str);
};

/**
 * Get the number of rounds used in a bcrypt hash
 * @param {String} hash - Bcrypt hash
 * @returns {Number|null} Number of rounds or null
 */
const getRounds = (hash) => {
  if (!isBcryptHash(hash)) {
    return null;
  }

  const rounds = parseInt(hash.split("$")[2]);
  return isNaN(rounds) ? null : rounds;
};

/**
 * Check if password needs to be rehashed (e.g., if salt rounds changed)
 * @param {String} hash - Current password hash
 * @returns {Boolean} True if rehashing needed
 */
const needsRehash = (hash) => {
  const currentRounds = getRounds(hash);

  if (currentRounds === null) {
    return true; // Not a valid bcrypt hash
  }

  // If rounds differ from current config, rehash needed
  return currentRounds !== SALT_ROUNDS;
};

module.exports = {
  // Async functions (recommended)
  hashPassword,
  comparePassword,

  // Sync functions (use sparingly)
  hashPasswordSync,
  comparePasswordSync,

  // Validation and utilities
  validatePasswordStrength,
  generateRandomPassword,
  isBcryptHash,
  getRounds,
  needsRehash,

  // Constants
  SALT_ROUNDS,
};
