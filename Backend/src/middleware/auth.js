const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is verified
    const user = await User.findById(decoded.userId).lean();

    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        message: 'Email not verified. Please verify your email before accessing this resource.',
        needsVerification: true
      });
    }

    // Add user info to request
    req.user = {
      id: String(user._id),
      email: user.email,
      name: user.name,
      emailVerified: user.emailVerified,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired' 
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Optional authentication - doesn't require email verification
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).lean();

    if (user) {
      req.user = {
        id: String(user._id),
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        role: user.role
      };
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Admin-only middleware
const requireAdmin = async (req, res, next) => {
  try {
    await authenticateToken(req, res, (err) => {
      if (err) return next(err);
    });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Admin access required' 
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin
};


