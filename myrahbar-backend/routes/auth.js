const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

// TEMPORARY: Upgrade any email to admin
router.get('/make-admin/:email', async (req, res) => {
  const User = require('../models/User');
  try {
    const user = await User.findOneAndUpdate(
      { email: req.params.email }, 
      { role: 'admin' }, 
      { new: true }
    );
    if (!user) return res.status(404).send('User not found in database. Make sure you registered this email first.');
    res.send('<h2>Success!</h2><p><b>' + user.email + '</b> is now an ADMIN.</p><p>Please go to the website, <b>Log Out</b>, and <b>Log In again</b>. Then open the Admin Panel and all data will show!</p>');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
