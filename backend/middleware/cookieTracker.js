const CookieConsent = require("../models/CookieConsent");
const crypto = require("crypto");

const cookieTracker = async (req, res, next) => {
  let sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    // Set cookie for 30 days
    res.cookie("sessionId", sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
  }

  try {
    const consent = await CookieConsent.findOne({ sessionId });
    
    if (consent) {
      consent.lastActive = new Date();
      if (!consent.pagesVisited.includes(req.originalUrl)) {
        consent.pagesVisited.push(req.originalUrl);
      }
      if (req.user && !consent.userId) {
        consent.userId = req.user._id;
      }
      await consent.save();
    } else {
      await CookieConsent.create({
        sessionId,
        userId: req.user ? req.user._id : undefined,
        ipAddress: req.ip,
        userAgent: req.get("User-Agent"),
        pagesVisited: [req.originalUrl],
      });
    }
  } catch (error) {
    console.error("Failed to track cookie:", error);
  }

  next();
};

module.exports = cookieTracker;
