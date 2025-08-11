const crypto = require('crypto');

// Generate a secure random token
const generateSecureToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate email verification token
const generateEmailVerificationToken = () => {
  return generateSecureToken(32);
};

// Generate password reset token
const generatePasswordResetToken = () => {
  return generateSecureToken(32);
};

// Hash a token for storage (optional security measure)
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Verify token by comparing hash
const verifyToken = (token, hashedToken) => {
  return hashToken(token) === hashedToken;
};

module.exports = {
  generateSecureToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  hashToken,
  verifyToken
};
