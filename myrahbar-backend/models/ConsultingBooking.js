const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    whatsapp: { type: String, required: true },
    topic: { type: String, required: true },
    slot: { type: String, required: true },
    message: { type: String, default: "" },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    counselorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["free", "paid", "pending"],
      default: "free",
    },
    sessionNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ConsultingBooking", bookingSchema);
