import logger from '#config/logger.js';
import { jwttoken } from '#utils/jwt.js';
import { cookies } from '#utils/cookies.js';
import { getUserById } from '#services/users.service.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = cookies.get(req, 'token');
    
    if (!token) {
      const authHeader = req.headers['authorization'];
      token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required', message: 'No access token provided' });
    }

    // Verify token
    const decoded = jwttoken.verify(token);
    
    // Get fresh user data
    const user = await getUserById(decoded.id);
    
    // Add user to request object
    req.user = user;
    
    logger.debug(`User ${user.id} authenticated successfully`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error.message === 'User not found') {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }
    if (error.message === 'Invalid or expired token') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      if (req.user.role !== requiredRole) {
        return res.status(403).json({ 
          message: `Access denied. ${requiredRole} role required.` 
        });
      }

      next();
    } catch (error) {
      logger.error('Role verification error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

export const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          message: `Access denied. One of the following roles required: ${allowedRoles.join(', ')}` 
        });
      }

      next();
    } catch (error) {
      logger.error('Role verification error:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};