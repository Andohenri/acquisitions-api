import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';
    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20; // 20 requests per interval for admin
        message = 'Admin rate limit exceeded. slow down!';
        break;
      case 'user':
        limit = 10; // 10 requests per interval for authenticated users
        message = 'User rate limit exceeded. slow down!';
        break;
      case 'guest':
        limit = 5; // 5 requests per interval for guests
        message = 'Guest rate limit exceeded. slow down!';
        break;
    }
    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);
    // if (decision.isDenied() && decision.reason.isBot()) {
    //   logger.warn('Bot request denied', {
    //     ip: req.ip,
    //     userAgent: req.get('User-Agent'),
    //     path: req.path,
    //   });
    //   return res.status(403).json({
    //     error: 'Access denied',
    //     message: 'Automated requests are not allowed.',
    //   });
    // }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });
      return res.status(403).json({
        error: 'Access denied',
        message: 'Request blocked by security policy.',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
      });
    }

    next();
  } catch (error) {
    logger.error('Error in security middleware:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Something went wrong with security middleware.',
    });
  }
};

export default securityMiddleware;
