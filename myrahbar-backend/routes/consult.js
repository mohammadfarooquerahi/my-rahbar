const express = require("express");
const router = express.Router();
const Booking = require("../models/ConsultingBooking");

// POST /api/consult/book
router.post("/book", async (req, res) => {
  const { name, email, whatsapp, topic, slot, message } = req.body;

  if (!name || !email || !whatsapp || !topic || !slot) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled." });
  }

  const booking = await Booking.create({
    name,
    email,
    whatsapp,
    topic,
    slot,
    message: message || "",
  });

  res.status(201).json({
    booking,
    message:
      "Booking confirmed. Our counselor will contact you on WhatsApp within 2 hours.",
  });
});

// GET /api/consult/slots â€” available time slots
router.get("/slots", (req, res) => {
  const slots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
  ];
  res.json({ slots });
});

module.exports = router;
