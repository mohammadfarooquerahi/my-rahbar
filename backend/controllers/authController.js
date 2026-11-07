const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const makeToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, whatsapp, password } = req.body;

  if (!name || !email || !whatsapp || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(400)
      .json({ message: "An account with this email already exists." });
  }

  const user = await User.create({ name, email, whatsapp, password });
  const token = makeToken(user._id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      role: user.role,
    },
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const match = await user.checkPassword(password);
  if (!match) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = makeToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      whatsapp: user.whatsapp,
      role: user.role,
      profile: user.profile,
    },
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

module.exports = { register, login, getMe, updateProfile };
