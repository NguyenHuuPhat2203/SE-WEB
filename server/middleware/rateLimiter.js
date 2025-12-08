// middleware/rateLimiter.js

/**
 * Simple in-memory rate limiter
 * For production, use redis-based solution like express-rate-limit with Redis
 */

const requestCounts = new Map();

/**
 * Rate limiting middleware
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum requests per window
 */
function rateLimiter(windowMs = 15 * 60 * 1000, maxRequests = 100) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Get or create request history for this IP
    if (!requestCounts.has(key)) {
      requestCounts.set(key, []);
    }
    
    const requests = requestCounts.get(key);
    
    // Remove old requests outside the window
    const validRequests = requests.filter(timestamp => now - timestamp < windowMs);
    
    // Check if limit exceeded
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }
    
    // Add current request
    validRequests.push(now);
    requestCounts.set(key, validRequests);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - validRequests.length);
    res.setHeader('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
    
    next();
  };
}

/**
 * Cleanup old entries periodically
 */
function startCleanup(intervalMs = 60 * 60 * 1000) {
  setInterval(() => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    
    for (const [key, requests] of requestCounts.entries()) {
      const validRequests = requests.filter(timestamp => timestamp > oneDayAgo);
      
      if (validRequests.length === 0) {
        requestCounts.delete(key);
      } else {
        requestCounts.set(key, validRequests);
      }
    }
    
    console.log(`Rate limiter cleanup: ${requestCounts.size} IPs tracked`);
  }, intervalMs);
}

module.exports = {
  rateLimiter,
  startCleanup,
};
