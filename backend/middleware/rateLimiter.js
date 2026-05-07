const rateLimit = new Map();

/**
 * Production-grade rate limiter middleware
 * Limits users to 1 request every 5 seconds
 */
const chatRateLimiter = (req, res, next) => {
  const userId = req.user?._id?.toString();
  if (!userId) return next();

  const now = Date.now();
  const COOLDOWN_MS = 5000;

  if (rateLimit.has(userId)) {
    const lastRequest = rateLimit.get(userId);
    const diff = now - lastRequest;

    if (diff < COOLDOWN_MS) {
      const waitSec = Math.ceil((COOLDOWN_MS - diff) / 1000);
      return res.status(429).json({
        success: false,
        errorType: 'RATE_LIMIT_EXCEEDED',
        message: `Chill bro, thoda slow. ${waitSec}s baad try karo.`
      });
    }
  }

  rateLimit.set(userId, now);
  
  // Periodic cleanup of the Map to prevent memory leaks
  if (rateLimit.size > 1000) {
    const expiry = now - COOLDOWN_MS;
    for (const [id, time] of rateLimit.entries()) {
      if (time < expiry) rateLimit.delete(id);
    }
  }

  next();
};

module.exports = { chatRateLimiter };
