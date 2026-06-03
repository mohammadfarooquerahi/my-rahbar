const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const makeToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  const { identifier, password, termsAccepted } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Contact identifier and password are required." });
  }

  if (!termsAccepted) {
    return res.status(400).json({ message: "You must accept the Terms & Conditions." });
  }

  // Detect if identifier is email or whatsapp
  const isEmail = identifier.includes("@");
  const email = isEmail ? identifier.toLowerCase().trim() : undefined;
  const whatsapp = !isEmail ? identifier.trim() : undefined;
  const contactMethod = isEmail ? "email" : "whatsapp";

  // Check if user exists
  const existing = await User.findOne(isEmail ? { email } : { whatsapp });
  if (existing) {
    return res.status(400).json({ message: "An account with this contact already exists." });
  }

  const user = await User.create({ 
    email, 
    wha
<truncated 4136 bytes>
 = Date.now() + 30 * 60 * 1000; // 30 minutes
  await user.save({ validateBeforeSave: false });

  // In a real scenario, send email or whatsapp here
  // const resetUrl = \`\${process.env.CLIENT_URL}/reset-password/\${resetToken}\`;
  
  res.json({ message: "Password reset instructions sent." });
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Token is invalid or has expired." });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const jwtToken = makeToken(user._id);
  
  res.json({
    token: jwtToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const allowed = ["name", "whatsapp", "profile"];
  const updates = {};
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });

  res.json({ user });
};

module.exports = { register, login, googleSignIn, forgotPassword, resetPassword, getMe, updateProfile };
