// Email validation using regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength validation
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Name validation
const isValidName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

// Validate signup data
const validateSignupData = (data) => {
  const errors = [];

  if (!data.name || !isValidName(data.name)) {
    errors.push('Name must be between 2 and 50 characters');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.password || !isStrongPassword(data.password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, and number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate login data
const validateLoginData = (data) => {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!data.password) {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate email verification
const validateEmailVerification = (token) => {
  if (!token || token.length !== 64) {
    return {
      isValid: false,
      error: 'Invalid verification token'
    };
  }
  return { isValid: true };
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidName,
  validateSignupData,
  validateLoginData,
  validateEmailVerification
};
