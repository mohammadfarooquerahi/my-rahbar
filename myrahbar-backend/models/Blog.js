const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title:          { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, lowercase: true },
    content:        { type: String, required: true },
    excerpt:        { type: String, required: true },
    category:       { type: String, required: true },
    author:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    featuredImage:  { type: String },
    coverColor:     { type: String, default: "#EFF6FF" },
    tags:           [{ type: String }],
    status:         { type: String, enum: ["draft", "published"], default: "draft" },
    views:          { type: Number, default: 0 },

    // SEO fields
    seoTitle:       { type: String, maxlength: 70 },
    seoDescription: { type: String, maxlength: 160 },
    keywords:       [{ type: String }],
    readTime:       { type: Number, default: 5 }, // in minutes
  },
  { timestamps: true }
);

// Text index for search
blogSchema.index({ title: "text", content: "text", tags: "text", keywords: "text" });

module.exports = mongoose.model("Blog", blogSchema);
