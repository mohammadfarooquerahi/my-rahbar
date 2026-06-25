const ErrorLog = require("../models/ErrorLog");

const errorTracker = async (err, req, res, next) => {
  // Log the error to the database
  try {
    await ErrorLog.create({
      message: err.message || "Unknown error",
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      userId: req.user ? req.user._id : null,
      userAgent: req.get("User-Agent"),
      severity: err.statusCode >= 500 ? "critical" : "error"
    });
  } catch (dbError) {
    console.error("Failed to log error to DB:", dbError);
  }

  // Send response
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  res.status(statusCode).json({
    message,
    // VULN-13 FIX: Never expose stack traces to clients — log to DB only
  });
};

module.exports = errorTracker;
