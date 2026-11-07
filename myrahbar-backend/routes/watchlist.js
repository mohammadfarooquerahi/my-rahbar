const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const University = require("../models/University");
const Alert = require("../models/Alert");
const sendEmail = require("../utils/sendEmail");

// GET /api/watchlist — get user's saved watchlist
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("watchlist");
    res.json({ watchlist: user?.watchlist || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Helper: resolve university by ID or slug
async function resolveUniversity(identifier) {
  if (!identifier) return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await University.findById(identifier);
    if (byId) return byId;
  }
  return await University.findOne({ slug: identifier.toString().toLowerCase().trim() });
}

// Helper: auto-create alert for a user and university
async function enrollUniversityAlert(user, uni) {
  try {
    if (!uni) return null;
    const targetUniId = uni._id;
    
    // Find effective deadline
    let effectiveDeadline = uni.admissionDeadline || null;
    if (!effectiveDeadline && uni.admissionDeadlines?.length > 0) {
      const now = new Date();
      const valid = uni.admissionDeadlines
        .map(d => new Date(d.deadline))
        .filter(d => !isNaN(d.getTime()) && d > now)
        .sort((a, b) => a - b);
      if (valid.length > 0) effectiveDeadline = valid[0];
    }

    // Check if alert exists
    let alert = await Alert.findOne({ userId: user._id, universityId: targetUniId });
    if (alert) {
      alert.isActive = true;
      if (effectiveDeadline) alert.deadline = effectiveDeadline;
      if (user.whatsapp) alert.whatsapp = user.whatsapp;
      if (user.email) alert.email = user.email;
      await alert.save();
    } else {
      alert = await Alert.create({
        userId: user._id,
        universityId: targetUniId,
        universityName: uni.name,
        deadline: effectiveDeadline,
        whatsapp: user.whatsapp || "",
        email: user.email,
        isActive: true,
      });
    }
    return alert;
  } catch (err) {
    console.warn("[watchlist] Auto-alert enrollment error:", err.message);
    return null;
  }
}

// POST /api/watchlist — add university to watchlist & auto-activate deadline alerts
router.post("/", protect, async (req, res) => {
  try {
    const { universityId, sendConfirmation } = req.body;
    if (!universityId) {
      return res.status(400).json({ message: "University ID or slug is required." });
    }

    const uni = await resolveUniversity(universityId);
    if (!uni) {
      return res.status(404).json({ message: "University not found." });
    }

    // Add to user's watchlist array
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { watchlist: uni._id } },
      { new: true }
    );

    // Auto-create/arm deadline alert
    const alert = await enrollUniversityAlert(user, uni);

    // Optional: send confirmation email to the student
    if (sendConfirmation !== false && user.email) {
      const deadlineStr = uni.admissionDeadline
        ? new Date(uni.admissionDeadline).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })
        : "Announced soon";

      sendEmail({
        to: user.email,
        subject: `⭐ ${uni.name} added to your Favorites — Rahbars Alerts Active`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 14px; padding: 26px; background: #ffffff;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #2563eb; margin: 0; font-size: 24px;">Rahbars</h2>
              <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">Pakistan Admission Guide</p>
            </div>
            <h3 style="color: #0f172a; margin-top: 0; font-size: 18px;">⭐ Added to Your Favorites!</h3>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Assalam-o-Alaikum <strong>${user.name || user.fullName || "Student"}</strong>,<br/>
              You have added <strong>${uni.name}</strong> to your saved universities.
            </p>
            <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 14px; border-radius: 8px; margin: 18px 0;">
              <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>University:</strong> ${uni.name} (${uni.shortName || uni.city})</p>
              <p style="margin: 6px 0 0; font-size: 14px; color: #2563eb;"><strong>Admission Deadline:</strong> ${deadlineStr}</p>
            </div>
            <p style="color: #475569; font-size: 13px; line-height: 1.5;">
              🔔 <strong>Automatic Alerts Active:</strong> We will automatically notify you by email <strong>7 days</strong> and <strong>1 day</strong> before the admission deadline so you never miss your application.
            </p>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://www.rahbars.com/university/${uni.slug}" style="display: inline-block; background: #0f172a; color: white; padding: 11px 22px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: bold;">View University Details</a>
            </div>
            <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0 14px;" />
            <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">Rahbars • <a href="https://www.rahbars.com/watchlist" style="color: #2563eb;">Manage your Watchlist</a></p>
          </div>
        `,
      }).catch((err) => console.warn("[watchlist] Confirmation email error:", err.message));
    }

    res.json({
      success: true,
      message: `Added ${uni.name} to favorites. Deadline alerts are active!`,
      alert,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/watchlist/sync — sync multiple saved items (e.g. from localStorage on login)
router.post("/sync", protect, async (req, res) => {
  try {
    const { universityIds } = req.body;
    if (!Array.isArray(universityIds) || universityIds.length === 0) {
      return res.json({ success: true, count: 0 });
    }

    const user = await User.findById(req.user._id);
    let synced = 0;

    for (const id of universityIds) {
      const uni = await resolveUniversity(id);
      if (uni) {
        if (!user.watchlist.some(w => w.toString() === uni._id.toString())) {
          user.watchlist.push(uni._id);
        }
        await enrollUniversityAlert(user, uni);
        synced++;
      }
    }

    await user.save();
    res.json({ success: true, syncedCount: synced, total: user.watchlist.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/watchlist/:id — remove from watchlist & deactivate alert
router.delete("/:id", protect, async (req, res) => {
  try {
    const uni = await resolveUniversity(req.params.id);
    const targetId = uni ? uni._id : req.params.id;

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { watchlist: targetId },
    });

    await Alert.findOneAndUpdate(
      { userId: req.user._id, universityId: targetId },
      { isActive: false }
    );

    res.json({ success: true, message: "Removed from watchlist and alerts deactivated." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;